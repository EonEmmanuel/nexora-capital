import { notFound } from "next/navigation";
import { requireUser } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { simulatePaymentAction } from "@/app/actions/checkout";
import { mockPaymentControlsEnabled } from "@/server/payments/mock-controls";
import { money } from "@/components/shared/format";
export default async function PaymentPage({
  params,
}: {
  params: Promise<{ paymentReference: string }>;
}) {
  const user = await requireUser();
  const { paymentReference } = await params;
  const p = await prisma.payment.findFirst({
    where: { paymentReference, userId: user.id },
    include: { allocation: { include: { pool: true } } },
  });
  if (!p) notFound();
  const mockControls = mockPaymentControlsEnabled();
  return (
    <main className="container" style={{ paddingTop: 48 }}>
      <span className="badge">Mock crypto checkout</span>
      <h1>Complete payment</h1>
      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <section className="card" style={{ padding: 24 }}>
          <h2>{p.allocation?.pool.name}</h2>
          <p className="muted">Send exactly:</p>
          <h2>{money(p.requestedAmount.toString(), p.currency)}</h2>
          <p>
            Asset: <b>{p.currency}</b>
          </p>
          <p>
            Network: <b>{p.network}</b>
          </p>
          <p>
            Status: <span className="badge">{p.status}</span>
          </p>
          <p>Expires: {p.expiresAt?.toLocaleString()}</p>
          <div className="card" style={{ padding: 18, textAlign: "center" }}>
            <svg viewBox="0 0 120 120" width="160">
              <rect width="120" height="120" fill="#fff" />
              <path
                d="M10 10h30v30H10zM80 10h30v30H80zM10 80h30v30H10zM55 55h15v15H55zM78 58h12v12H78zM60 88h45v12H60z"
                fill="#06101d"
              />
            </svg>
            <p className="muted">Demo QR placeholder</p>
          </div>
        </section>
        <aside className="card" style={{ padding: 24 }}>
          <h2>Wallet address</h2>
          <code style={{ wordBreak: "break-all" }}>{p.walletAddress}</code>
          <p className="muted">
            Only send {p.currency} on {p.network}. Funds sent using an
            unsupported network may be unrecoverable.
          </p>
          {mockControls ? (
            <form
              action={simulatePaymentAction.bind(null, p.paymentReference)}
              className="grid"
            >
              <button className="btn btn-ghost" name="status" value="DETECTED">
                Simulate detected
              </button>
              <button
                className="btn btn-ghost"
                name="status"
                value="CONFIRMING"
              >
                Simulate confirming
              </button>
              <button
                className="btn btn-primary"
                name="status"
                value="COMPLETED"
              >
                Simulate completed
              </button>
            </form>
          ) : (
            <p className="muted">
              Mock controls are disabled outside development mock mode.
            </p>
          )}
        </aside>
      </div>
    </main>
  );
}
