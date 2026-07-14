import Link from "next/link";
import { requireUser } from "@/server/auth/session";
import { getDashboardOverview } from "@/server/services/dashboard";
import { money } from "@/components/shared/format";
export const metadata = { title: "Dashboard" };
export default async function Dashboard() {
  const user = await requireUser();
  const data = await getDashboardOverview(user.id);
  return (
    <section>
      <span className="badge">Welcome, {user.firstName}</span>
      <h1>Portfolio command center</h1>
      <div className="grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        {[
          ["Total allocated", money(data.totalAllocated.toString())],
          ["Current value", money(data.currentValue.toString())],
          ["Total return", money(data.totalReturn.toString())],
          ["Active pools", String(data.active.length)],
        ].map(([a, b]) => (
          <div className="card" style={{ padding: 20 }} key={a}>
            <p className="muted">{a}</p>
            <h2>{b}</h2>
          </div>
        ))}
      </div>
      <div
        className="grid"
        style={{ gridTemplateColumns: "1.2fr .8fr", marginTop: 24 }}
      >
        <div className="card" style={{ padding: 24 }}>
          <h2>Portfolio performance</h2>
          <svg viewBox="0 0 700 220" width="100%">
            <polyline
              points="20,180 120,160 220,165 320,120 420,115 520,80 660,60"
              fill="none"
              stroke="#2ff2a0"
              strokeWidth="5"
            />
          </svg>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <h2>Recent notifications</h2>
          {data.notifications.map((n) => (
            <p key={n.id}>
              <b>{n.title}</b>
              <br />
              <span className="muted">{n.message}</span>
            </p>
          ))}
        </div>
      </div>
      <h2>Active pools</h2>
      <div className="grid" style={{ gridTemplateColumns: "repeat(2,1fr)" }}>
        {data.active.length ? (
          data.active.map((a) => (
            <Link
              className="card"
              style={{ padding: 20, textDecoration: "none", color: "white" }}
              href={`/dashboard/pools/${a.id}`}
              key={a.id}
            >
              <b>{a.pool.name}</b>
              <p className="muted">
                {money(a.currentValue.toString(), a.currency)} • {a.status}
              </p>
            </Link>
          ))
        ) : (
          <div className="card" style={{ padding: 24 }}>
            No active allocations yet. <Link href="/pools">Explore pools</Link>.
          </div>
        )}
      </div>
      <h2>Recent transactions</h2>
      <table className="table">
        <tbody>
          {data.transactions.map((t) => (
            <tr key={t.id}>
              <td>{t.reference}</td>
              <td>{t.type}</td>
              <td>{money(t.amount.toString(), t.currency)}</td>
              <td>{t.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
