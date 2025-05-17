import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });
  const { searchParams } = new URL(req.url);

  const fromParams = searchParams.get('from');
  const toParams = searchParams.get('to');
  const typeOfRecord = searchParams.get('typeOfRecord'); //income or expense, if not set to All
  const amountFrom = Number(searchParams.get('amountFrom') ?? 0);
  const amountToRaw = searchParams.get('amountTo');
  const amountTo =
    amountToRaw && amountToRaw !== 'any' ? Number(amountToRaw) : null;

  let fromDate: Date;
  if (fromParams) {
    fromDate = new Date(fromParams);
  } else {
    const now = new Date();
    fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }
  let toDate: Date;
  if (toParams) {
    const [year, month] = toParams.split('-').map(Number);
    const firstDayNextMonth = new Date(year, month, 1); // 注意这里 month 是从 0 开始计数
    toDate = new Date(firstDayNextMonth.getTime() - 1);
  } else {
    toDate = new Date(); // 默认设为今天
  }

  const recordTypeFilter =
    typeOfRecord && typeOfRecord !== 'all' ? typeOfRecord : {};

  const amountFilter = amountTo
    ? { amount: { get: amountFrom, lte: amountTo } }
    : { amount: { gte: amountFrom } };

  try {
    const records = await prisma.record.findMany({
      where: {
        userId,
        date: {
          gte: fromDate,
          lte: toDate,
        },
        ...recordTypeFilter,
        ...amountFilter,
      },
      orderBy: {
        date: 'desc',
      },
    });
    return NextResponse.json({ data: records });
  } catch (error) {
    console.error('Error fetching records:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
