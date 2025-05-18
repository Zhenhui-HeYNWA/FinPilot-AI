import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const res = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY!}`,
      },
    });
    const clerkUser = await res.json();
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!existingUser) {
      const newUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email: clerkUser.email_addresses?.[0]?.email_address ?? '',
          name: clerkUser.first_name ?? '',
          lastLogin: new Date(),
        },
      });
      return NextResponse.json({ created: true, user: newUser });
    } else {
      const updated = await prisma.user.update({
        where: { clerkId: userId },
        data: { lastLogin: new Date() },
      });
      return NextResponse.json({ updated: true, user: updated });
    }
  } catch (error) {
    console.error('❌ Failed to sync user:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }

  // try {
  //   const { userId } = await auth();
  //   console.log('userId:', userId);
  //   if (!userId) {
  //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  //   }

  //   // 获取 Clerk 用户数据
  //   const clerkRes = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
  //     headers: {
  //       Authorization: `Bearer ${process.env.CLERK_SECRET_KEY!}`,
  //     },
  //   });

  //   const clerkUser = await clerkRes.json();

  //   const email = clerkUser.email_addresses?.[0]?.email_address ?? '';
  //   const name = clerkUser.first_name ?? '';
  //   const now = new Date();

  //   // 查找用户是否已存在
  //   const existingUser = await prisma.user.findUnique({
  //     where: { clerkId: userId },
  //   });

  //   if (!existingUser) {
  //     // 如果不存在 → 新增用户
  //     const created = await prisma.user.create({
  //       data: {
  //         clerkId: userId,
  //         email,
  //         name,
  //         lastLogin: now,
  //       },
  //     });
  //     return NextResponse.json({ created: true, user: created });
  //   }

  //   // 如果已存在 → 更新 lastLogin 时间
  //   const updated = await prisma.user.update({
  //     where: { clerkId: userId },
  //     data: {
  //       lastLogin: now,
  //     },
  //   });

  //   return NextResponse.json({ updated: true, user: updated });
  // } catch (err) {
  //   console.error('❌ Failed to sync user:', err);
  //   return NextResponse.json(
  //     { error: 'Internal Server Error' },
  //     { status: 500 }
  //   );
  // }
}
