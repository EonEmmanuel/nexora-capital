import Link from "next/link";
import { visibleAdminNav, type Role } from "@/server/permissions/rbac";
import { signOutAction } from "@/app/actions/auth";
export function AdminShell({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  const nav = visibleAdminNav(role);
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <h2>Nexora Ops</h2>
        <p className="muted">{role}</p>
        {nav.map(([href, label]) => (
          <Link key={href} href={href}>
            {label}
          </Link>
        ))}
      </aside>
      <main className="admin-workspace">
        <header className="admin-topbar">
          <form action="/admin/search">
            <input
              name="q"
              placeholder="Search users, allocations, payments..."
            />
          </form>
          <form action={signOutAction}>
            <button className="btn btn-ghost">Sign out</button>
          </form>
        </header>
        {children}
      </main>
    </div>
  );
}
