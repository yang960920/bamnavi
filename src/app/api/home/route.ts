import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/** 메인 페이지 데이터를 한 번에 병렬 조회 */
export async function GET() {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const [banners, memberCount, onlineCount, todayPostCount, recentPosts] =
      await Promise.all([
        // 배너
        prisma.banner.findMany({
          where: { active: true },
          orderBy: { order: 'asc' },
        }),
        // 총 회원 수
        prisma.user.count(),
        // 온라인 수
        prisma.user.count({ where: { lastActiveAt: { gte: fiveMinutesAgo } } }),
        // 오늘 게시글 수
        prisma.post.count({ where: { createdAt: { gte: todayStart } } }),
        // 최근 활동 3건
        prisma.post.findMany({
          orderBy: { createdAt: 'desc' },
          take: 3,
          include: {
            author: { select: { id: true, nickname: true } },
            tags: { select: { name: true } },
          },
        }),
      ]);

    return NextResponse.json({
      banners,
      stats: { memberCount, onlineCount, todayPostCount },
      recentPosts,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
