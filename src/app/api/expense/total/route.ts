import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const { userId } = await auth();

  if (!userId) return new Response('Unauthorized', { status: 401 });

  const records = await prisma.record.findMany({
    where: { userId },
    select: { recordType: true, amount: true },
  });

  const result = await prisma.record.aggregate({
    where: { userId, recordType: 'expense' },
    _sum: {
      amount: true,
    },
  });

  return NextResponse.json({ totalExpense: result._sum.amount || 0 });
}
