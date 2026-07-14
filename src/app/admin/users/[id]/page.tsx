import { requireAuthorized } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { notFound } from "next/navigation";
import { money } from "@/components/shared/format";
import { userRoleAction, userStatusAction } from "@/app/actions/admin";
export default async function UserDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuthorized("users.read");
  const { id } = await params;
  const u = await prisma.user.findUnique({
    where: { id },
    include: {
      allocations: { include: { pool: true } },
      transactions: true,
      payments: true,
      withdrawals: true,
      tickets: true,
      auditLogs: true,
    },
  });
  if (!u) notFound();
  return (
    <section>
      <h1>
        {u.firstName} {u.lastName}
      </h1>
      <p className="muted">
        {u.email} • {u.role} • {u.status} • KYC {u.kycStatus}
      </p>
      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <form
          action={userStatusAction.bind(null, u.id)}
          className="card"
          style={{ padding: 18 }}
        >
          <h2>Account status</h2>
          <select name="status" defaultValue={u.status}>
            <option>ACTIVE</option>
            <option>SUSPENDED</option>
            <option>RESTRICTED</option>
          </select>
          <button className="btn btn-primary">Update status</button>
        </form>
        <form
          action={userRoleAction.bind(null, u.id)}
          className="card"
          style={{ padding: 18 }}
        >
          <h2>Role</h2>
          <select name="role" defaultValue={u.role}>
            <option>USER</option>
            <option>SUPPORT</option>
            <option>ANALYST</option>
            <option>FINANCE</option>
            <option>ADMIN</option>
            <option>SUPER_ADMIN</option>
          </select>
          <button className="btn btn-ghost">Change role</button>
        </form>
      </div>
      <h2>Allocations</h2>
      <table className="table">
        <tbody>
          {u.allocations.map((a) => (
            <tr key={a.id}>
              <td>{a.reference}</td>
              <td>{a.pool.name}</td>
              <td>{money(a.currentValue.toString(), a.currency)}</td>
              <td>{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Payments</h2>
      <table className="table">
        <tbody>
          {u.payments.map((p) => (
            <tr key={p.id}>
              <td>{p.paymentReference}</td>
              <td>{money(p.requestedAmount.toString(), p.currency)}</td>
              <td>{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Audit activity</h2>
      {u.auditLogs.map((a) => (
        <p key={a.id}>
          {a.action}: <span className="muted">{a.description}</span>
        </p>
      ))}
    </section>
  );
}
