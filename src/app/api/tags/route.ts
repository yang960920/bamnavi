import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { posts: true } } },
    });
    return NextResponse.json({ tags });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: '?쒕쾭 ?ㅻ쪟' }, { status: 500 });
  }
}
