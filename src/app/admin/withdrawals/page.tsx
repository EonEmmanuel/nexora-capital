import { requireAuthorized } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { money } from "@/components/shared/format";
import { withdrawalReviewAction } from "@/app/actions/admin";
export default async function Withdrawals() {
  await requireAuthorized("withdrawals.read");
  const rows = await prisma.withdrawal.findMany({
    include: { user: true, allocation: { include: { pool: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return (
    <section>
      <h1>Withdrawal review</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Reference</th>
            <th>User</th>
            <th>Amount</th>
            <th>Fee</th>
            <th>Net</th>
            <th>Asset</th>
            <th>Network</th>
            <th>KYC</th>
            <th>Status</th>
            <th>Review</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((w) => (
            <tr key={w.id}>
              <td>{w.reference}</td>
              <td>
                {w.user.email}
                <br />
                <span className="muted">{w.destinationAddress}</span>
              </td>
              <td>{money(w.amount.toString(), w.currency)}</td>
              <td>{money(w.fee.toString(), w.currency)}</td>
              <td>{money(w.netAmount.toString(), w.currency)}</td>
              <td>{w.currency}</td>
              <td>{w.network}</td>
              <td>{w.user.kycStatus}</td>
              <td>{w.status}</td>
              <td>
                <form
                  action={withdrawalReviewAction.bind(null, w.id)}
                  className="grid"
                >
                  <select name="status">
                    <option>UNDER_REVIEW</option>
                    <option>APPROVED</option>
                    <option>PROCESSING</option>
                    <option>COMPLETED</option>
                    <option>REJECTED</option>
                  </select>
                  <input name="reason" placeholder="Rejection reason" />
                  <button className="btn btn-primary">Apply</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
