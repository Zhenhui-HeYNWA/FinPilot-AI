// ✅ THIS IS FOR APP ROUTER ONLY
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { subMonths, setDate } from 'date-fns';

const prisma = new PrismaClient();

const expenseCategories = [
  'food',
  'shopping',
  'transport',
  'entertainment',
  'housing',
  'bill',
  'health',
  'education',
  'other',
];

const incomeCategories = [
  'salary',
  'bonus',
  'investment',
  'gift',
  'refund',
  'other',
];

function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomAmount(min: number, max: number): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

// ✅ Named export for POST
export async function POST(req: NextRequest) {
  const body = await req.json();
  const userClerkId = body.clerkId || 'user_2wwCzlxRjBcJf0KvPU9jP0E5hpl';

  const user = await prisma.user.findUnique({
    where: { clerkId: userClerkId },
  });

  if (!user) {
    return NextResponse.json(
      { error: `User ${userClerkId} not found` },
      { status: 404 }
    );
  }

  const records = [];

  for (let i = 0; i < 12; i++) {
    const baseDate = subMonths(new Date(), i);
    const date = setDate(baseDate, Math.floor(Math.random() * 28) + 1);

    const incomeCount = Math.floor(Math.random() * 3) + 2;
    for (let j = 0; j < incomeCount; j++) {
      records.push({
        userId: user.clerkId,
        recordType: 'income',
        amount: getRandomAmount(500, 5000),
        category: getRandom(incomeCategories),
        description: 'Mock income',
        date,
        createdAt: new Date(),
      });
    }

    const expenseCount = Math.floor(Math.random() * 4) + 3;
    for (let j = 0; j < expenseCount; j++) {
      records.push({
        userId: user.clerkId,
        recordType: 'expense',
        amount: getRandomAmount(50, 1200),
        category: getRandom(expenseCategories),
        description: 'Mock expense',
        date,
        createdAt: new Date(),
      });
    }
  }

  await prisma.record.createMany({ data: records });

  return NextResponse.json({
    message: `✅ Inserted ${records.length} records for ${userClerkId}`,
  });
}
