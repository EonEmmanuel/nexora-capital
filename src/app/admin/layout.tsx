import { requireUser } from "@/server/auth/session";
import { hasAnyAdminPermission, type Role } from "@/server/permissions/rbac";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const role = user.role as Role;
  if (!hasAnyAdminPermission(role)) redirect("/forbidden");
  return <AdminShell role={role}>{children}</AdminShell>;
}
