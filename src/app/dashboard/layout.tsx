import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireUser } from "@/server/auth/session";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  return <DashboardShell userId={user.id}>{children}</DashboardShell>;
}
