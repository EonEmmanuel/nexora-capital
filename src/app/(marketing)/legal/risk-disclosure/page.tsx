import { brand } from "@/config/brand";
export const metadata = { title: "Risk disclosure" };
export default function Page() {
  return (
    <main className="container" style={{ paddingTop: 56 }}>
      <span className="badge">risk disclosure</span>
      <h1 style={{ fontSize: 54, textTransform: "capitalize" }}>
        risk disclosure
      </h1>
      <div className="card" style={{ padding: 28 }}>
        <p className="muted">
          Premium risk disclosure content for {brand.companyName}. This page is
          structured for CMS-backed content in later phases and uses the shared
          marketing layout, disclosures, and design system.
        </p>
        <p>{brand.riskDisclosure}</p>
      </div>
    </main>
  );
}
