import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const { userId } = await auth();

  if (!userId) return new Response('Unauthorized', { status: 401 });

  const records = await prisma.record.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
  });

  return Response.json(records);
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new Response('Unauthorized', { status: 401 });

    // 确保数据库中有该用户
    const dbUser = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        lastLogin: new Date(), // 更新最后登录时间
      },
      create: {
        clerkId: userId, // 用户的 Clerk ID
        email: '', // 初次创建时，邮箱为空（你可以根据需求填充）
        name: '', // 初次创建时，姓名为空（你可以根据需求填充）
        lastLogin: new Date(), // 初次创建时设置登录时间
      },
    });

    const data = await req.json();

    // 创建记录
    const newRecord = await prisma.record.create({
      data: {
        ...data,
        userId: dbUser.clerkId, // 使用数据库中的 userId
      },
    });

    return NextResponse.json(newRecord);
  } catch (err) {
    console.error('❌ Error creating record:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });
  const { searchParams } = new URL(req.url);
  console.log('searchParams', searchParams);
  const recordId = searchParams.get('recordId');
  if (!recordId) return new Response('Record ID is required', { status: 400 });

  try {
    const data = await req.json();

    const updatedRecord = await prisma.record.update({
      where: { id: recordId },
      data: {
        ...data,
      },
    });

    return NextResponse.json(updatedRecord);
  } catch (error) {
    console.error('Error updating record:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { userId } = await auth();

  if (!userId) return new Response('Unauthorized', { status: 401 });

  const { searchParams } = new URL(req.url);

  const recordId = searchParams.get('recordId');

  if (!recordId) return new Response('Record ID is required', { status: 400 });

  try {
    const deleteREcord = await prisma.record.delete({
      where: {
        userId,
        id: recordId,
      },
    });

    return NextResponse.json({ data: deleteREcord });
  } catch (error) {
    console.error('Error deleting record:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
