import { Nav } from "@/components/marketing/Nav";
import { brand } from "@/config/brand";
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      {children}
      <footer
        className="container"
        style={{
          padding: "56px 24px",
          borderTop: "1px solid #1d3045",
          marginTop: 80,
        }}
      >
        <b>{brand.companyName}</b>
        <p className="muted">{brand.riskDisclosure}</p>
        <p>
          <a href="/legal/terms">Terms</a> ·{" "}
          <a href="/legal/privacy">Privacy</a> ·{" "}
          <a href="/legal/risk-disclosure">Risk disclosure</a>
        </p>
      </footer>
    </>
  );
}
