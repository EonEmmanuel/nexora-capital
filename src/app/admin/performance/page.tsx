import { requireAuthorized } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { addPerformanceAction } from "@/app/actions/admin";
export default async function Performance() {
  await requireAuthorized("performance.read");
  const pools = await prisma.tradingPool.findMany({
    include: { performance: { orderBy: { date: "desc" }, take: 10 } },
  });
  return (
    <section>
      <h1>Performance management</h1>
      <form
        action={addPerformanceAction}
        className="card grid"
        style={{ padding: 18 }}
      >
        <select name="poolId">
          {pools.map((p) => (
            <option value={p.id} key={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <input name="date" type="date" />
        <input name="nav" placeholder="NAV" />
        <input name="dailyReturnPercent" placeholder="Daily return %" />
        <input
          name="cumulativeReturnPercent"
          placeholder="Cumulative return %"
        />
        <input name="benchmarkReturnPercent" placeholder="Benchmark return %" />
        <input name="drawdownPercent" placeholder="Drawdown %" />
        <input name="assetsUnderManagement" placeholder="AUM" />
        <button className="btn btn-primary">Add / update audited entry</button>
      </form>
      {pools.map((p) => (
        <div className="card" style={{ padding: 18, marginTop: 18 }} key={p.id}>
          <h2>{p.name}</h2>
          <table className="table">
            <tbody>
              {p.performance.map((x) => (
                <tr key={x.id}>
                  <td>{x.date.toLocaleDateString()}</td>
                  <td>NAV {x.nav.toString()}</td>
                  <td>{x.cumulativeReturnPercent.toString()}%</td>
                  <td>DD {x.drawdownPercent.toString()}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </section>
  );
}
