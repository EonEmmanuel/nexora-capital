export type MockPaymentTransition = "DETECTED" | "CONFIRMING" | "COMPLETED";
export type UserMockPaymentSourceStatus = "PENDING" | "DETECTED" | "CONFIRMING";
export function mockPaymentControlsEnabled(
  env = process.env.NODE_ENV,
  provider = process.env.PAYMENT_PROVIDER,
) {
  return env !== "production" && provider === "mock";
}
export function assertMockPaymentControlsEnabled() {
  if (!mockPaymentControlsEnabled())
    throw new Error("Mock payment controls are disabled.");
}
export function isValidMockPaymentTransition(
  status: string,
): status is MockPaymentTransition {
  return (
    status === "DETECTED" || status === "CONFIRMING" || status === "COMPLETED"
  );
}
const userTransitionSources: Record<
  MockPaymentTransition,
  UserMockPaymentSourceStatus
> = {
  DETECTED: "PENDING",
  CONFIRMING: "DETECTED",
  COMPLETED: "CONFIRMING",
};
export function expectedUserMockPaymentSource(
  nextStatus: MockPaymentTransition,
) {
  return userTransitionSources[nextStatus];
}
export function canUserAdvanceMockPayment(
  currentStatus: string,
  nextStatus: MockPaymentTransition,
) {
  return currentStatus === expectedUserMockPaymentSource(nextStatus);
}
