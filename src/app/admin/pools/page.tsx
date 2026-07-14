import Link from "next/link";
import { requireAuthorized } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { money } from "@/components/shared/format";
import { setPoolStatusAction } from "@/app/actions/admin";
export default async function AdminPools() {
  await requireAuthorized("pools.read");
  const pools = await prisma.tradingPool.findMany({
    orderBy: { displayOrder: "asc" },
  });
  return (
    <section>
      <h1>Trading pools</h1>
      <Link className="btn btn-primary" href="/admin/pools/new">
        Create pool
      </Link>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Risk</th>
            <th>Capacity</th>
            <th>Featured</th>
            <th>Lifecycle</th>
          </tr>
        </thead>
        <tbody>
          {pools.map((p) => (
            <tr key={p.id}>
              <td>
                <Link href={`/admin/pools/${p.id}`}>{p.name}</Link>
              </td>
              <td>{p.status}</td>
              <td>{p.riskLevel}</td>
              <td>
                {money(p.currentlyAllocated.toString(), p.baseCurrency)} /{" "}
                {money(p.totalCapacity.toString(), p.baseCurrency)}
              </td>
              <td>{p.featured ? "Yes" : "No"}</td>
              <td>
                <form action={setPoolStatusAction.bind(null, p.id, "OPEN")}>
                  <button className="btn btn-ghost">Publish/Open</button>
                </form>
                <form action={setPoolStatusAction.bind(null, p.id, "PAUSED")}>
                  <button className="btn btn-ghost">Pause</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
