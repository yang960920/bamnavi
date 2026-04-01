import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  // 5분 이내 heartbeat가 있으면 온라인으로 간주
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

  const [memberCount, onlineCount, todayPostCount] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { lastActiveAt: { gte: fiveMinutesAgo } } }),
    prisma.post.count({ where: { createdAt: { gte: todayStart } } }),
  ]);

  return NextResponse.json({ memberCount, onlineCount, todayPostCount });
}
