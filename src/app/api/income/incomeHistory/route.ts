import { startOfDay, subDays, subMonths } from 'date-fns';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const range = searchParams.get('range') || '6months';
  const { userId: clerkId } = await auth();
  if (!clerkId) return new Response('Unauthorized', { status: 401 });

  let fromDate = new Date();
  switch (range) {
    case 'week':
      fromDate = subDays(fromDate, 7);
      break;
    case 'month':
      fromDate = subMonths(fromDate, 1);
      break;
    case 'year':
      fromDate = subMonths(fromDate, 11);
      break;
    default:
      fromDate = subMonths(fromDate, 5);
      break;
  }

  try {
    const incomeRecords = await prisma.record.findMany({
      where: {
        userId: clerkId,
        recordType: 'income',
        date: {
          gte: startOfDay(fromDate),
        },
      },
      orderBy: { date: 'asc' },
    });

    return NextResponse.json({ data: incomeRecords });
  } catch (error) {
    console.error('Error fetching income records:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
