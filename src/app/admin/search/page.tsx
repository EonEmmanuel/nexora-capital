import Link from "next/link";
import { requireUser } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import {
  canSearchResource,
  hasAnyAdminPermission,
  type Role,
} from "@/server/permissions/rbac";
import { redirect } from "next/navigation";
export default async function Search({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const user = await requireUser();
  const role = user.role as Role;
  if (!hasAnyAdminPermission(role)) redirect("/forbidden");
  const q = (await searchParams).q?.trim() ?? "";
  const users =
    q && canSearchResource(role, "users")
      ? await prisma.user.findMany({
          where: {
            OR: [
              { email: { contains: q, mode: "insensitive" } },
              { firstName: { contains: q, mode: "insensitive" } },
              { lastName: { contains: q, mode: "insensitive" } },
            ],
          },
          take: 10,
        })
      : [];
  const allocations =
    q && canSearchResource(role, "allocations")
      ? await prisma.allocation.findMany({
          where: { reference: { contains: q, mode: "insensitive" } },
          take: 10,
        })
      : [];
  const payments =
    q && canSearchResource(role, "payments")
      ? await prisma.payment.findMany({
          where: { paymentReference: { contains: q, mode: "insensitive" } },
          take: 10,
        })
      : [];
  const withdrawals =
    q && canSearchResource(role, "withdrawals")
      ? await prisma.withdrawal.findMany({
          where: { reference: { contains: q, mode: "insensitive" } },
          take: 10,
        })
      : [];
  const pools =
    q && canSearchResource(role, "pools")
      ? await prisma.tradingPool.findMany({
          where: {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { slug: { contains: q, mode: "insensitive" } },
            ],
          },
          take: 10,
        })
      : [];
  return (
    <section>
      <h1>Admin search</h1>
      <p className="muted">Results for {q || "—"}</p>
      {users.map((u) => (
        <p key={u.id}>
          User <Link href={`/admin/users/${u.id}`}>{u.email}</Link>
        </p>
      ))}
      {pools.map((p) => (
        <p key={p.id}>
          Pool <Link href={`/admin/pools/${p.id}`}>{p.name}</Link>
        </p>
      ))}
      {allocations.map((a) => (
        <p key={a.id}>Allocation {a.reference}</p>
      ))}
      {payments.map((p) => (
        <p key={p.id}>Payment {p.paymentReference}</p>
      ))}
      {withdrawals.map((w) => (
        <p key={w.id}>Withdrawal {w.reference}</p>
      ))}
    </section>
  );
}
