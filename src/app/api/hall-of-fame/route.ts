import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // ?대쾲 二??붿슂??00:00 湲곗?
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
    monday.setHours(0, 0, 0, 0);

    const posts = await prisma.post.findMany({
      where: { createdAt: { gte: monday } },
      orderBy: { reactions: { _count: 'desc' } },
      take: 5,
      include: {
        author: { select: { id: true, nickname: true, avatarUrl: true } },
        tags: true,
        _count: { select: { comments: true, reactions: true } },
      },
    });

    return NextResponse.json({ posts, weekStart: monday });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: '?쒕쾭 ?ㅻ쪟' }, { status: 500 });
  }
}
