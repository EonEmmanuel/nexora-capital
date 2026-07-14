import { Prisma } from '@prisma/client';
import { prisma } from '@/server/db/prisma';
import { calculateWithdrawalFee, canRequestWithdrawal } from '@/server/services/rules';
import { brand } from '@/config/brand';

export async function getEligibleWithdrawalAmount(userId: string) {
  const [active, pending] = await Promise.all([
    prisma.allocation.findMany({ where: { userId, status: 'ACTIVE' } }),
    prisma.withdrawal.findMany({ where: { userId, status: { in: ['REQUESTED', 'UNDER_REVIEW', 'APPROVED', 'PROCESSING'] } } }),
  ]);
  const grossEligible = active.reduce((sum, allocation) => sum.plus(allocation.currentValue.minus(allocation.initialValue).plus(allocation.totalDistributed)), new Prisma.Decimal(0));
  const reserved = pending.reduce((sum, withdrawal) => sum.plus(withdrawal.amount), new Prisma.Decimal(0));
  const remaining = grossEligible.minus(reserved);
  return remaining.gt(0) ? remaining : new Prisma.Decimal(0);
}

export async function requestWithdrawal(input: { userId: string; allocationId?: string; amount: string; currency: string; network: string; destinationAddress: string }) {
  const amount = new Prisma.Decimal(input.amount);
  const eligible = await getEligibleWithdrawalAmount(input.userId);
  if (!canRequestWithdrawal(amount, eligible, brand.withdrawal.minimum)) throw new Error('Withdrawal amount is outside eligible limits.');
  if (input.destinationAddress.length < 16) throw new Error('Destination address is too short.');
  const fee = calculateWithdrawalFee(amount, brand.withdrawal.feePercent);
  return prisma.$transaction(async (tx) => {
    const withdrawal = await tx.withdrawal.create({ data: { userId: input.userId, allocationId: input.allocationId, reference: `WDR-${Date.now()}`, amount, fee, netAmount: amount.minus(fee), currency: input.currency, network: input.network, destinationAddress: input.destinationAddress, status: 'REQUESTED' } });
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
