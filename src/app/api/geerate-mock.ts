// pages/api/generate-mock.ts
import { PrismaClient } from '@prisma/client';
import { subMonths, setDate } from 'date-fns';
import type { NextApiRequest, NextApiResponse } from 'next';

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userClerkId = 'user_2wwCzlxRjBcJf0KvPU9jP0E5hpl';

  if (!userClerkId) {
    return res.status(400).json({ error: 'Missing clerkId' });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userClerkId },
  });

  if (!user) {
    return res.status(404).json({ error: `User ${userClerkId} not found` });
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

  return res.status(200).json({
    message: `Inserted ${records.length} records for ${userClerkId}`,
  });
}
