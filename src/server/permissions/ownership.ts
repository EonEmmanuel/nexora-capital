export function userOwnedTicketWhere(userId: string, ticketId: string) { return { id: ticketId, userId }; }
export function userOwnedActiveAllocationWhere(userId: string, allocationId: string) { return { id: allocationId, userId, status: 'ACTIVE' as const }; }
