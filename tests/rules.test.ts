import { describe, expect, it } from "vitest";
import {
  canAllocateToPool,
  calculateWithdrawalFee,
  canRequestWithdrawal,
} from "../src/server/services/rules";
import {
  canSearchResource,
  defaultAdminPathForRole,
  hasAnyAdminPermission,
  hasPermission,
} from "../src/server/permissions/rbac";
import {
  userOwnedActiveAllocationWhere,
  userOwnedPaymentWhere,
  userOwnedTicketWhere,
} from "../src/server/permissions/ownership";
import {
  canUserAdvanceMockPayment,
  expectedUserMockPaymentSource,
  isValidMockPaymentTransition,
  mockPaymentControlsEnabled,
} from "../src/server/payments/mock-controls";
import {
  createSessionToken,
  SESSION_MAX_AGE_MS,
  verifySessionToken,
} from "../src/server/auth/session";
import {
  enumParam,
  normalizeQuery,
  safeCapacityUtilization,
  safePercent,
} from "../src/lib/safe-math";
import {
  calculateRemainingWithdrawalEligibility,
  withdrawalLedgerReference,
  WITHDRAWAL_CONSUMING_STATUSES,
} from "../src/server/services/withdrawals";

describe("financial allocation rules", () => {
  it("rejects allocations below minimum", () => {
    expect(
      canAllocateToPool({
        amount: "99",
        minimum: "100",
        maximum: "1000",
        capacity: "10000",
        allocated: "0",
        status: "OPEN",
      }).ok,
    ).toBe(false);
  });
  it("rejects allocations above maximum", () => {
    expect(
      canAllocateToPool({
        amount: "1500",
        minimum: "100",
        maximum: "1000",
        capacity: "10000",
        allocated: "0",
        status: "OPEN",
      }).ok,
    ).toBe(false);
  });
  it("rejects allocations above remaining capacity", () => {
    expect(
      canAllocateToPool({
        amount: "600",
        minimum: "100",
        maximum: "1000",
        capacity: "1000",
        allocated: "500",
        status: "OPEN",
      }).ok,
    ).toBe(false);
  });
  it("rejects closed or paused pools", () => {
    expect(
      canAllocateToPool({
        amount: "500",
        minimum: "100",
        maximum: "1000",
        capacity: "1000",
        allocated: "0",
        status: "PAUSED",
      }).ok,
    ).toBe(false);
  });
  it("accepts a valid open-pool allocation", () => {
    expect(
      canAllocateToPool({
        amount: "500",
        minimum: "100",
        maximum: "1000",
        capacity: "1000",
        allocated: "0",
        status: "OPEN",
      }).ok,
    ).toBe(true);
  });
});

describe("withdrawal rules", () => {
  it("calculates withdrawal fees with Decimal", () => {
    expect(calculateWithdrawalFee("1000", "0.5").toString()).toBe("5");
  });
  it("rejects withdrawal requests above eligibility", () => {
    expect(canRequestWithdrawal("1001", "1000", "100")).toBe(false);
  });
  it("rejects withdrawal requests below minimum", () => {
    expect(canRequestWithdrawal("50", "1000", "100")).toBe(false);
  });
});

describe("withdrawal entitlement accounting", () => {
  const allocation = {
    currentValue: "2000",
    initialValue: "1000",
    totalDistributed: "0",
  };
  it("deducts completed withdrawals from future eligibility", () => {
    expect(
      calculateRemainingWithdrawalEligibility(
        [allocation],
        [{ amount: "700", status: "COMPLETED" }],
      ).toString(),
    ).toBe("300");
  });
  it("reserves requested, under-review, approved, and processing withdrawals", () => {
    for (const status of [
      "REQUESTED",
      "UNDER_REVIEW",
      "APPROVED",
      "PROCESSING",
    ] as const) {
      expect(
        calculateRemainingWithdrawalEligibility(
          [allocation],
          [{ amount: "250", status }],
        ).toString(),
      ).toBe("750");
    }
  });
  it("does not deduct rejected or cancelled withdrawals", () => {
    expect(
      calculateRemainingWithdrawalEligibility(
        [allocation],
        [{ amount: "700", status: "REJECTED" }],
      ).toString(),
    ).toBe("1000");
    expect(
      calculateRemainingWithdrawalEligibility(
        [allocation],
        [{ amount: "700", status: "CANCELLED" }],
      ).toString(),
    ).toBe("1000");
  });
  it("never returns negative eligibility", () => {
    expect(
      calculateRemainingWithdrawalEligibility(
        [allocation],
        [{ amount: "1500", status: "COMPLETED" }],
      ).toString(),
    ).toBe("0");
  });
  it("centralizes the statuses that consume entitlement", () => {
    expect(WITHDRAWAL_CONSUMING_STATUSES).toEqual([
      "REQUESTED",
      "UNDER_REVIEW",
      "APPROVED",
      "PROCESSING",
      "COMPLETED",
    ]);
  });
  it("models concurrent withdrawal safety after the first transaction commits", () => {
    const firstRemaining = calculateRemainingWithdrawalEligibility(
      [allocation],
      [{ amount: "700", status: "REQUESTED" }],
    );
    expect(firstRemaining.toString()).toBe("300");
    expect(canRequestWithdrawal("700", firstRemaining, "100")).toBe(false);
  });
  it("allows two serialized withdrawals that exactly consume entitlement", () => {
    const afterFirst = calculateRemainingWithdrawalEligibility(
      [allocation],
      [{ amount: "500", status: "REQUESTED" }],
    );
    expect(canRequestWithdrawal("500", afterFirst, "100")).toBe(true);
    const afterSecond = calculateRemainingWithdrawalEligibility(
      [allocation],
      [
        { amount: "500", status: "REQUESTED" },
        { amount: "500", status: "REQUESTED" },
      ],
    );
    expect(afterSecond.toString()).toBe("0");
  });

  it("uses a deterministic withdrawal ledger reference for idempotent completion entries", () => {
    expect(withdrawalLedgerReference("WDR-123")).toBe("TX-WDR-123");
  });
});

describe("RBAC and admin shell access", () => {
  it("allows analyst into the admin shell through legitimate admin permissions", () => {
    expect(hasAnyAdminPermission("ANALYST")).toBe(true);
  });
  it("blocks normal users from the admin shell and financial operations", () => {
    expect(hasAnyAdminPermission("USER")).toBe(false);
    expect(hasPermission("USER", "payments.manage")).toBe(false);
  });
  it("allows finance to review withdrawals but not manage settings", () => {
    expect(hasPermission("FINANCE", "withdrawals.review")).toBe(true);
    expect(hasPermission("FINANCE", "settings.manage")).toBe(false);
  });
  it("allows super admin full settings access", () => {
    expect(hasPermission("SUPER_ADMIN", "settings.manage")).toBe(true);
  });
  it("chooses permitted landing pages for limited staff roles", () => {
    expect(defaultAdminPathForRole("SUPPORT")).toBe("/admin/users");
    expect(defaultAdminPathForRole("ANALYST")).toBe("/admin/pools");
    expect(defaultAdminPathForRole("FINANCE")).toBe("/admin");
    expect(defaultAdminPathForRole("USER")).toBe("/dashboard");
  });
});

describe("admin search authorization", () => {
  it("prevents support from searching financial resources", () => {
    expect(canSearchResource("SUPPORT", "users")).toBe(true);
    expect(canSearchResource("SUPPORT", "allocations")).toBe(false);
    expect(canSearchResource("SUPPORT", "payments")).toBe(false);
    expect(canSearchResource("SUPPORT", "withdrawals")).toBe(false);
  });
  it("limits finance search to financial resources in its RBAC configuration", () => {
    expect(canSearchResource("FINANCE", "allocations")).toBe(true);
    expect(canSearchResource("FINANCE", "payments")).toBe(true);
    expect(canSearchResource("FINANCE", "withdrawals")).toBe(true);
    expect(canSearchResource("FINANCE", "users")).toBe(false);
  });
  it("allows super admin to search all supported resources", () => {
    expect(
      ["users", "allocations", "payments", "withdrawals", "pools"].every(
        (resource) => canSearchResource("SUPER_ADMIN", resource as never),
      ),
    ).toBe(true);
  });
});

describe("object ownership query boundaries", () => {
  it("constrains user support replies to the owning user and ticket", () => {
    expect(userOwnedTicketWhere("user_a", "ticket_1")).toEqual({
      id: "ticket_1",
      userId: "user_a",
    });
  });
  it("constrains withdrawal allocations to active allocations owned by the user", () => {
    expect(userOwnedActiveAllocationWhere("user_a", "allocation_1")).toEqual({
      id: "allocation_1",
      userId: "user_a",
      status: "ACTIVE",
    });
  });
});

describe("mock payment authorization helpers", () => {
  it("permits only expected mock payment transitions", () => {
    expect(isValidMockPaymentTransition("DETECTED")).toBe(true);
    expect(isValidMockPaymentTransition("CONFIRMING")).toBe(true);
    expect(isValidMockPaymentTransition("COMPLETED")).toBe(true);
    expect(isValidMockPaymentTransition("REFUNDED")).toBe(false);
  });
  it("disables mock payment controls in production or non-mock provider mode", () => {
    expect(mockPaymentControlsEnabled("development", "mock")).toBe(true);
    expect(mockPaymentControlsEnabled("production", "mock")).toBe(false);
    expect(mockPaymentControlsEnabled("development", "real-provider")).toBe(
      false,
    );
  });
  it("constrains user mock payment lookup to the owning user and payment reference", () => {
    expect(userOwnedPaymentWhere("user_a", "PAY-1")).toEqual({
      paymentReference: "PAY-1",
      userId: "user_a",
    });
  });
  it("enforces forward-only user mock payment transitions and blocks review states", () => {
    expect(canUserAdvanceMockPayment("PENDING", "DETECTED")).toBe(true);
    expect(canUserAdvanceMockPayment("DETECTED", "CONFIRMING")).toBe(true);
    expect(canUserAdvanceMockPayment("CONFIRMING", "COMPLETED")).toBe(true);
    expect(canUserAdvanceMockPayment("PENDING", "COMPLETED")).toBe(false);
    expect(canUserAdvanceMockPayment("CONFIRMING", "DETECTED")).toBe(false);
    expect(canUserAdvanceMockPayment("UNDER_REVIEW", "COMPLETED")).toBe(false);
  });
  it("derives exact expected source statuses for atomic user payment updates", () => {
    expect(expectedUserMockPaymentSource("DETECTED")).toBe("PENDING");
    expect(expectedUserMockPaymentSource("CONFIRMING")).toBe("DETECTED");
    expect(expectedUserMockPaymentSource("COMPLETED")).toBe("CONFIRMING");
  });
  it("rejects stale concurrent user transition attempts", () => {
    expect(canUserAdvanceMockPayment("DETECTED", "DETECTED")).toBe(false);
    expect(canUserAdvanceMockPayment("CONFIRMING", "CONFIRMING")).toBe(false);
    expect(canUserAdvanceMockPayment("COMPLETED", "COMPLETED")).toBe(false);
  });
});

describe("session token verification", () => {
  it("accepts valid signed tokens before expiration", () => {
    process.env.AUTH_SECRET = "test-secret";
    const now = 1_700_000_000_000;
    const token = createSessionToken("user_123", now);
    expect(verifySessionToken(token, now + 1000)).toBe("user_123");
  });
  it("rejects invalid signatures and malformed tokens", () => {
    process.env.AUTH_SECRET = "test-secret";
    const now = 1_700_000_000_000;
    const token = createSessionToken("user_123", now);
    const parts = token.split(".");
    expect(
      verifySessionToken(`${parts[0]}.${parts[1]}.invalid`, now),
    ).toBeNull();
    expect(verifySessionToken("not-a-session", now)).toBeNull();
  });
  it("does not throw for unicode signatures with mismatched byte lengths", () => {
    process.env.AUTH_SECRET = "test-secret";
    const now = 1_700_000_000_000;
    expect(() =>
      verifySessionToken(`user_123.${now}.😀😀😀`, now),
    ).not.toThrow();
    expect(verifySessionToken(`user_123.${now}.😀😀😀`, now)).toBeNull();
  });
  it("rejects expired and unreasonably future-dated tokens", () => {
    process.env.AUTH_SECRET = "test-secret";
    const now = 1_700_000_000_000;
    expect(
      verifySessionToken(
        createSessionToken("user_123", now - SESSION_MAX_AGE_MS - 1),
        now,
      ),
    ).toBeNull();
    expect(
      verifySessionToken(
        createSessionToken("user_123", now + 1000 * 60 * 6),
        now,
      ),
    ).toBeNull();
  });
});

describe("query normalization and safe percentages", () => {
  it("normalizes empty query and enum values safely", () => {
    expect(normalizeQuery("   ")).toBeUndefined();
    expect(enumParam("", ["OPEN", "CLOSED"] as const)).toBeUndefined();
    expect(enumParam("BOGUS", ["OPEN", "CLOSED"] as const)).toBeUndefined();
    expect(enumParam("OPEN", ["OPEN", "CLOSED"] as const)).toBe("OPEN");
  });
  it("does not emit NaN or Infinity for zero-capacity utilization", () => {
    expect(safeCapacityUtilization(100, 0)).toBe(0);
    expect(Number.isFinite(safePercent(100, 0))).toBe(true);
  });
  it("models the guarded capacity predicate used by payment completion", () => {
    const capacity = 1000;
    const current = 300;
    const first = current + 700 <= capacity;
    const secondAfterFirst = current + 700 + 700 <= capacity;
    expect(first).toBe(true);
    expect(secondAfterFirst).toBe(false);
  });
});
