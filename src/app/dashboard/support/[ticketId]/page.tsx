import { notFound } from "next/navigation";
import { requireUser } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { replyTicketAction } from "@/app/actions/support";
export default async function Ticket({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const user = await requireUser();
  const { ticketId } = await params;
  const ticket = await prisma.supportTicket.findFirst({
    where: { id: ticketId, userId: user.id },
    include: { messages: true },
  });
  if (!ticket) notFound();
  return (
    <section>
      <span className="badge">{ticket.status}</span>
      <h1>{ticket.subject}</h1>
      <div className="card" style={{ padding: 24 }}>
        {ticket.messages.map((m) => (
          <article
            key={m.id}
            style={{ borderBottom: "1px solid #1d3045", padding: 12 }}
          >
            <p>{m.body}</p>
            <p className="muted">{m.createdAt.toLocaleString()}</p>
          </article>
        ))}
      </div>
      <form
        action={replyTicketAction.bind(null, ticket.id)}
        className="card grid"
        style={{ padding: 24, marginTop: 24 }}
      >
        <textarea name="message" placeholder="Reply" />
        <button className="btn btn-primary">Send reply</button>
      </form>
    </section>
  );
}
