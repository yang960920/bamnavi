import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 12;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get('page') ?? 1));
    const tag = searchParams.get('tag');
    const search = searchParams.get('search') ?? '';

    const where = {
      ...(tag ? { tags: { some: { name: tag } } } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' as const } },
              { content: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: {
          author: { select: { id: true, nickname: true, avatarUrl: true } },
          tags: true,
          _count: { select: { comments: true, reactions: true } },
        },
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({ posts, total, totalPages: Math.ceil(total / PAGE_SIZE), page });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: '?쒕쾭 ?ㅻ쪟' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: '濡쒓렇?몄씠 ?꾩슂?⑸땲??' }, { status: 401 });

    const { title, content, imageUrl, tags } = await req.json();
    if (!title || !imageUrl) {
      return NextResponse.json({ error: '?쒕ぉ怨??대?吏???꾩닔?낅땲??' }, { status: 400 });
    }

    // ?쒓렇 upsert
    const tagRecords = await Promise.all(
      (tags ?? []).map((t: string) =>
        prisma.tag.upsert({ where: { name: t }, create: { name: t }, update: {} })
      )
    );

    const post = await prisma.post.create({
      data: {
        title,
        content: content ?? null,
        imageUrl,
        authorId: session.userId,
        tags: { connect: tagRecords.map((t) => ({ id: t.id })) },
      },
      include: {
        author: { select: { id: true, nickname: true, avatarUrl: true } },
        tags: true,
        _count: { select: { comments: true, reactions: true } },
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: '?쒕쾭 ?ㅻ쪟' }, { status: 500 });
  }
}
