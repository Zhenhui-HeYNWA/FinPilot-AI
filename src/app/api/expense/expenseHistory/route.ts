import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { startOfDay, subDays, subMonths } from 'date-fns';
import { NextRequest, NextResponse } from 'next/server';

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
    const expenseRecords = await prisma.record.findMany({
      where: {
        userId: clerkId,
        recordType: 'expense',
        date: {
          gte: startOfDay(fromDate),
        },
      },

      orderBy: { date: 'asc' },
    });
    return NextResponse.json({ data: expenseRecords });
  } catch (error) {
    console.error('Error fetching expense records:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
