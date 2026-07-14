'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireAuthorized, requireUser } from '@/server/auth/session';
import { adminAdvancePayment, savePool, setPoolStatus, addPerformance, updateSetting, updateUserRole, updateUserStatus } from '@/server/services/admin';
import { reviewWithdrawal } from '@/server/services/withdrawals';
import { prisma } from '@/server/db/prisma';
import type { Role } from '@/server/permissions/rbac';

export async function savePoolAction(id:string|undefined,formData:FormData){const u=await requireUser();const p=await savePool(u.id,u.role as Role,formData,id);redirect(`/admin/pools/${p.id}`)}
export async function setPoolStatusAction(id:string,status:'DRAFT'|'UPCOMING'|'OPEN'|'FULL'|'PAUSED'|'CLOSED'|'ARCHIVED'){const u=await requireUser();await setPoolStatus(u.id,u.role as Role,id,status);revalidatePath('/admin/pools')}
export async function addPerformanceAction(formData:FormData){const u=await requireUser();await addPerformance(u.id,u.role as Role,formData);revalidatePath('/admin/performance')}
export async function adminPaymentAction(ref:string,formData:FormData){const u=await requireUser();await adminAdvancePayment(u.id,u.role as Role,ref,String(formData.get('status')) as never);revalidatePath('/admin/payments')}
export async function withdrawalReviewAction(id:string,formData:FormData){const u=await requireAuthorized('withdrawals.review');await reviewWithdrawal({actorId:u.id,withdrawalId:id,status:String(formData.get('status')) as never,reason:String(formData.get('reason')??'')});revalidatePath('/admin/withdrawals')}
export async function userStatusAction(userId:string,formData:FormData){const u=await requireUser();await updateUserStatus(u.id,u.role as Role,userId,String(formData.get('status')) as never);revalidatePath(`/admin/users/${userId}`)}
export async function userRoleAction(userId:string,formData:FormData){const u=await requireUser();await updateUserRole(u.id,u.role as Role,userId,String(formData.get('role')) as Role);revalidatePath(`/admin/users/${userId}`)}
export async function supportAdminReplyAction(ticketId:string,formData:FormData){const u=await requireAuthorized('support.manage');const body=String(formData.get('message'));const status=String(formData.get('status')??'PENDING');const ticket=await prisma.supportTicket.update({where:{id:ticketId},data:{status,messages:{create:{authorId:u.id,body,internal:false}}}});await prisma.notification.create({data:{userId:ticket.userId,title:'Support replied',message:body,type:'INFO',actionUrl:`/dashboard/support/${ticketId}`}});await prisma.auditLog.create({data:{actorId:u.id,action:'support.replied',entityType:'SupportTicket',entityId:ticketId,description:'Support ticket reply posted'}});revalidatePath(`/admin/support/${ticketId}`)}
export async function settingAction(formData:FormData){const u=await requireUser();await updateSetting(u.id,u.role as Role,String(formData.get('key')),String(formData.get('value')));revalidatePath('/admin/settings')}
