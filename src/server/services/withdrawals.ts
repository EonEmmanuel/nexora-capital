import { Prisma, WithdrawalStatus } from '@prisma/client';
import { prisma } from '@/server/db/prisma';
import { calculateWithdrawalFee, canRequestWithdrawal } from '@/server/services/rules';
import { brand } from '@/config/brand';
import { userOwnedActiveAllocationWhere } from '@/server/permissions/ownership';

// Cumulative-entitlement invariant: allocation balances are not reduced when a withdrawal completes.
// Remaining eligibility is lifetime gross entitlement minus every withdrawal amount already reserved or consumed.
export const WITHDRAWAL_CONSUMING_STATUSES = [
  WithdrawalStatus.REQUESTED,
  WithdrawalStatus.UNDER_REVIEW,
  WithdrawalStatus.APPROVED,
  WithdrawalStatus.PROCESSING,
  WithdrawalStatus.COMPLETED,
] as const;

type EligibilityAllocation = { currentValue: Prisma.Decimal | Prisma.Decimal.Value; initialValue: Prisma.Decimal | Prisma.Decimal.Value; totalDistributed: Prisma.Decimal | Prisma.Decimal.Value };
type EligibilityWithdrawal = { amount: Prisma.Decimal | Prisma.Decimal.Value; status: WithdrawalStatus | string };

function decimal(value: Prisma.Decimal | Prisma.Decimal.Value) { return new Prisma.Decimal(value); }

export function calculateRemainingWithdrawalEligibility(allocations: EligibilityAllocation[], withdrawals: EligibilityWithdrawal[]) {
  const grossEligible = allocations.reduce((sum, allocation) => sum.plus(decimal(allocation.currentValue).minus(decimal(allocation.initialValue)).plus(decimal(allocation.totalDistributed))), new Prisma.Decimal(0));
  const consumedOrReserved = withdrawals
    .filter((withdrawal) => WITHDRAWAL_CONSUMING_STATUSES.includes(withdrawal.status as WithdrawalStatus))
    .reduce((sum, withdrawal) => sum.plus(decimal(withdrawal.amount)), new Prisma.Decimal(0));
  const remaining = grossEligible.minus(consumedOrReserved);
  return remaining.gt(0) ? remaining : new Prisma.Decimal(0);
}

export async function getEligibleWithdrawalAmount(userId: string) {
  const [active, withdrawals] = await Promise.all([
    prisma.allocation.findMany({ where: { userId, status: 'ACTIVE' } }),
    prisma.withdrawal.findMany({ where: { userId, status: { in: [...WITHDRAWAL_CONSUMING_STATUSES] } } }),
  ]);
  return calculateRemainingWithdrawalEligibility(active, withdrawals);
}

export async function requestWithdrawal(input: { userId: string; allocationId?: string; amount: string; currency: string; network: string; destinationAddress: string }) {
  const amount = new Prisma.Decimal(input.amount);
  if (input.destinationAddress.length < 16) throw new Error('Destination address is too short.');
  return prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT "id" FROM "User" WHERE "id" = ${input.userId} FOR UPDATE`;
    await tx.$queryRaw`SELECT "id" FROM "Allocation" WHERE "userId" = ${input.userId} AND "status" = 'ACTIVE' FOR UPDATE`;
    const activeAllocations = await tx.allocation.findMany({ where: { userId: input.userId, status: 'ACTIVE' } });
    let verifiedAllocationId: string | undefined;
    if (input.allocationId) {
      const allocation = await tx.allocation.findFirst({ where: userOwnedActiveAllocationWhere(input.userId, input.allocationId) });
      if (!allocation) throw new Error('Allocation not found or not eligible for withdrawal.');
      verifiedAllocationId = allocation.id;
    }
    const withdrawals = await tx.withdrawal.findMany({ where: { userId: input.userId, status: { in: [...WITHDRAWAL_CONSUMING_STATUSES] } } });
    const eligible = calculateRemainingWithdrawalEligibility(activeAllocations, withdrawals);
    if (!canRequestWithdrawal(amount, eligible, brand.withdrawal.minimum)) throw new Error('Withdrawal amount is outside eligible limits.');
    const fee = calculateWithdrawalFee(amount, brand.withdrawal.feePercent);
    const withdrawal = await tx.withdrawal.create({ data: { userId: input.userId, allocationId: verifiedAllocationId, reference: `WDR-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`, amount, fee, netAmount: amount.minus(fee), currency: input.currency, network: input.network, destinationAddress: input.destinationAddress, status: 'REQUESTED' } });
    await tx.notification.create({ data: { userId: input.userId, title: 'Withdrawal requested', message: `Your ${input.currency} withdrawal is under review.`, type: 'WITHDRAWAL', actionUrl: '/dashboard/withdrawals' } });
    return withdrawal;
  });
}

export async function reviewWithdrawal(input:{actorId:string;withdrawalId:string;status:'UNDER_REVIEW'|'APPROVED'|'PROCESSING'|'COMPLETED'|'REJECTED';reason?:string}){
  if(input.status==='REJECTED'&&!input.reason) throw new Error('Rejection reason is required.');
  return prisma.$transaction(async(tx)=>{
    const withdrawal=await tx.withdrawal.findUniqueOrThrow({where:{id:input.withdrawalId},include:{user:true}});
    const allowed:Record<string,string[]>={REQUESTED:['UNDER_REVIEW','APPROVED','REJECTED'],UNDER_REVIEW:['APPROVED','REJECTED'],APPROVED:['PROCESSING','REJECTED'],PROCESSING:['COMPLETED'],COMPLETED:[],REJECTED:[],CANCELLED:[]};
    if(!allowed[withdrawal.status]?.includes(input.status)) throw new Error(`Invalid withdrawal transition from ${withdrawal.status} to ${input.status}.`);
    const updated=await tx.withdrawal.update({where:{id:withdrawal.id},data:{status:input.status,reviewedById:input.actorId,reviewedAt:new Date(),completedAt:input.status==='COMPLETED'?new Date():undefined,rejectionReason:input.status==='REJECTED'?input.reason:withdrawal.rejectionReason}});
    await tx.auditLog.create({data:{actorId:input.actorId,action:`withdrawal.${input.status.toLowerCase()}`,entityType:'Withdrawal',entityId:withdrawal.id,description:`Withdrawal ${withdrawal.reference} moved to ${input.status}${input.reason?`: ${input.reason}`:''}`}});
    await tx.notification.create({data:{userId:withdrawal.userId,title:'Withdrawal status updated',message:`Withdrawal ${withdrawal.reference} is now ${input.status}.`,type:'WITHDRAWAL',actionUrl:'/dashboard/withdrawals'}});
    return updated;
  });
}
