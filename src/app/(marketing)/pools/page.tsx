import { pools } from "@/features/pools/data";
import { PoolCard } from "@/components/marketing/PoolCard";
export const metadata = { title: "Trading Pools" };
export default function Pools() {
  return (
    <main className="container" style={{ paddingTop: 56 }}>
      <span className="badge">Marketplace</span>
      <h1 style={{ fontSize: 54 }}>Trading pool marketplace</h1>
      <p className="muted">
        Browse database-ready pool products by risk, status, capacity, minimum
        allocation, and strategy.
      </p>
      <div
        className="card"
        style={{ padding: 16, display: "flex", gap: 12, margin: "28px 0" }}
      >
        <input
          aria-label="Search pools"
          placeholder="Search pools"
          style={{
            flex: 1,
            background: "#081322",
            border: "1px solid #1d3045",
            borderRadius: 14,
            color: "white",
            padding: 14,
          }}
        />
        <button className="btn btn-primary">Search</button>
        <span className="badge">Risk filters</span>
        <span className="badge">Status filters</span>
      </div>
      <div className="grid" style={{ gridTemplateColumns: "repeat(2,1fr)" }}>
        {pools.map((p) => (
          <PoolCard key={p.slug} pool={p} />
        ))}
      </div>
    </main>
  );
}
