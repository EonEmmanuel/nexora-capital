import { notFound } from "next/navigation";
import { requireAuthorized } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { savePoolAction, setPoolStatusAction } from "@/app/actions/admin";
export default async function EditPool({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuthorized("pools.update");
  const { id } = await params;
  const p = await prisma.tradingPool.findUnique({ where: { id } });
  if (!p) notFound();
  return (
    <section>
      <h1>Edit {p.name}</h1>
      <form
        action={savePoolAction.bind(null, p.id)}
        className="card grid"
        style={{ padding: 24 }}
      >
        <input name="name" defaultValue={p.name} />
        <input name="slug" defaultValue={p.slug} />
        <input name="shortDescription" defaultValue={p.shortDescription} />
        <textarea name="fullDescription" defaultValue={p.fullDescription} />
        <textarea
          name="strategyDescription"
          defaultValue={p.strategyDescription}
        />
        <select name="riskLevel" defaultValue={p.riskLevel}>
          <option>CONSERVATIVE</option>
          <option>MODERATE</option>
          <option>BALANCED</option>
          <option>AGGRESSIVE</option>
          <option>HIGH_RISK</option>
        </select>
        <input name="baseCurrency" defaultValue={p.baseCurrency} />
        <input
          name="minimumAllocation"
          defaultValue={p.minimumAllocation.toString()}
        />
        <input
          name="maximumAllocation"
          defaultValue={p.maximumAllocation.toString()}
        />
        <input name="totalCapacity" defaultValue={p.totalCapacity.toString()} />
        <input
          name="managementFeePercent"
          defaultValue={p.managementFeePercent.toString()}
        />
        <input
          name="performanceFeePercent"
          defaultValue={p.performanceFeePercent.toString()}
        />
        <label>
          <input
            type="checkbox"
            name="flexibleDuration"
            defaultChecked={p.flexibleDuration}
          />{" "}
          Flexible duration
        </label>
        <input name="durationDays" defaultValue={p.durationDays ?? ""} />
        <input name="heroImage" defaultValue={p.heroImage ?? ""} />
        <input name="icon" defaultValue={p.icon ?? ""} />
        <label>
          <input type="checkbox" name="featured" defaultChecked={p.featured} />{" "}
          Featured
        </label>
        <input name="displayOrder" defaultValue={p.displayOrder} />
        <select name="status" defaultValue={p.status}>
          <option>DRAFT</option>
          <option>UPCOMING</option>
          <option>OPEN</option>
          <option>FULL</option>
          <option>PAUSED</option>
          <option>CLOSED</option>
          <option>ARCHIVED</option>
        </select>
        <button className="btn btn-primary">Save changes</button>
      </form>
      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        {["OPEN", "PAUSED", "CLOSED", "ARCHIVED"].map((s) => (
          <form
            key={s}
            action={setPoolStatusAction.bind(null, p.id, s as never)}
          >
            <button className="btn btn-ghost">{s}</button>
          </form>
        ))}
      </div>
    </section>
  );
}
