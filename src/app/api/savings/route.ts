import { prisma } from '@/lib/prisma';
import { savingsGoalSchema } from '@/lib/zod/validation';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new Response('Unauthorized', { status: 401 });

    // 确保数据库中有该用户
    const dbUser = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        lastLogin: new Date(),
      },
      create: {
        clerkId: userId,
        email: '',
        name: '',
        lastLogin: new Date(),
      },
    });

    const data = await req.json();
    const parsed = savingsGoalSchema.safeParse(data);
    if (!parsed.success) {
      return new Response(JSON.stringify(parsed.error.format()), {
        status: 400,
      });
    }

    const {
      savingsGoalName,
      targetAmount,
      currentAmount,
      monthlyContribution,
      annualInterestRate,
    } = parsed.data;

    // 先查是否已有 SavingsGoal
    const existingGoal = await prisma.savingsGoal.findUnique({
      where: { userId: dbUser.clerkId },
    });

    let newGoal;

    if (existingGoal) {
      // 有则更新
      newGoal = await prisma.savingsGoal.update({
        where: { userId: dbUser.clerkId },
        data: {
          savingsGoalName,
          targetAmount,
          currentAmount,
          monthlyContribution,
          annualInterestRate,
        },
      });
    } else {
      // 没有则创建并记录初始存款为一条历史记录
      newGoal = await prisma.savingsGoal.create({
        data: {
          userId: dbUser.clerkId,
          savingsGoalName,
          targetAmount,
          currentAmount,
          monthlyContribution,
          annualInterestRate,
        },
      });
    }

    return NextResponse.json(newGoal);
  } catch (error) {
    console.error('❌ Error creating savings goal:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });
  try {
    const record = await prisma.savingsGoal.findFirst({
      where: { userId },
      select: {
        targetAmount: true,
        currentAmount: true,
      },
    });
    return NextResponse.json(record);
  } catch (error) {
    console.error('❌ Error fetching savings goals:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });

  try {
    const savingsGoal = await prisma.savingsGoal.findUnique({
      where: { userId },
    });
    if (!savingsGoal) {
      return new Response('Savings goal not found', { status: 404 });
    }
    //Calculate new current amount
    const newCurrentAmount =
      savingsGoal.currentAmount + savingsGoal.monthlyContribution;

    const isCompleted = newCurrentAmount >= savingsGoal.targetAmount;

    //更新 SavingsGoal
    const updatedGoal = await prisma.savingsGoal.update({
      where: { userId },
      data: {
        currentAmount: newCurrentAmount,
        lastSavingsDate: new Date(),
        isCompleted,
      },
    });

    //insert a new history record
    await prisma.savingsGoalHistory.create({
      data: {
        savingsGoalId: savingsGoal.id,
        amountSaved: savingsGoal.monthlyContribution,
        savedAt: new Date(),
      },
    });

    return NextResponse.json(updatedGoal);
  } catch (error) {
    console.error('❌ Error updating savings goal:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
