'use server';
import { redirect } from 'next/navigation';
import { requireUser } from '@/server/auth/session';
import { requestWithdrawal } from '@/server/services/withdrawals';
export async function requestWithdrawalAction(formData:FormData){const user=await requireUser();await requestWithdrawal({userId:user.id,allocationId:String(formData.get('allocationId') || '') || undefined,amount:String(formData.get('amount')),currency:String(formData.get('currency')??'USDT'),network:String(formData.get('network')??'TRON'),destinationAddress:String(formData.get('destinationAddress'))});redirect('/dashboard/withdrawals')}
