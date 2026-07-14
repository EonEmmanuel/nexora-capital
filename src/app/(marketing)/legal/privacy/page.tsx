import { brand } from "@/config/brand";
export const metadata = { title: "Privacy" };
export default function Page() {
  return (
    <main className="container" style={{ paddingTop: 56 }}>
      <span className="badge">privacy</span>
      <h1 style={{ fontSize: 54, textTransform: "capitalize" }}>privacy</h1>
      <div className="card" style={{ padding: 28 }}>
        <p className="muted">
          Premium privacy content for {brand.companyName}. This page is
          structured for CMS-backed content in later phases and uses the shared
          marketing layout, disclosures, and design system.
        </p>
        <p>{brand.riskDisclosure}</p>
      </div>
    </main>
  );
}
