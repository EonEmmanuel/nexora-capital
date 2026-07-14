import { requireAuthorized } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { settingAction } from "@/app/actions/admin";
export default async function Settings() {
  await requireAuthorized("settings.manage");
  const settings = await prisma.platformSetting.findMany({
    orderBy: { key: "asc" },
  });
  const keys = [
    "registration.enabled",
    "maintenance.enabled",
    "currency.default",
    "withdrawal.minimum",
    "withdrawal.feePercent",
    "kyc.requiredBeforeWithdrawal",
    "referrals.rules",
    "support.email",
    "payments.mock.enabled",
  ];
  return (
    <section>
      <h1>Platform settings</h1>
      <p className="muted">
        Operational settings only. Secrets remain in environment variables.
      </p>
      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {keys.map((k) => (
          <form
            action={settingAction}
            className="card"
            style={{ padding: 18 }}
            key={k}
          >
            <input type="hidden" name="key" value={k} />
            <b>{k}</b>
            <textarea
              name="value"
              defaultValue={String(
                settings.find((s) => s.key === k)?.value ?? "",
              )}
            />
            <button className="btn btn-primary">Save audited setting</button>
          </form>
        ))}
      </div>
    </section>
  );
}
