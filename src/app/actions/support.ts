'use server';
import { redirect } from 'next/navigation';
import { requireUser } from '@/server/auth/session';
import { prisma } from '@/server/db/prisma';
import { userOwnedTicketWhere } from '@/server/permissions/ownership';
export async function createTicketAction(formData: FormData){const user=await requireUser();const ticket=await prisma.supportTicket.create({data:{userId:user.id,subject:String(formData.get('subject')),category:String(formData.get('category')??'Other'),priority:String(formData.get('priority')??'Normal'),status:'OPEN',messages:{create:{authorId:user.id,body:String(formData.get('message')),internal:false}}}});redirect(`/dashboard/support/${ticket.id}`)}
export async function replyTicketAction(ticketId:string,formData:FormData){const user=await requireUser();const ticket=await prisma.supportTicket.findFirst({where:userOwnedTicketWhere(user.id,ticketId)});if(!ticket)throw new Error('Support ticket not found.');if(['CLOSED','RESOLVED'].includes(ticket.status))throw new Error('This support ticket is closed.');await prisma.supportMessage.create({data:{ticketId:ticket.id,authorId:user.id,body:String(formData.get('message')),internal:false}});redirect(`/dashboard/support/${ticket.id}`)}
