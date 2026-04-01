import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, nickname: true, avatarUrl: true } },
        tags: true,
        comments: {
          orderBy: { createdAt: 'asc' },
          include: { author: { select: { id: true, nickname: true, avatarUrl: true } } },
        },
        reactions: true,
        _count: { select: { comments: true, reactions: true } },
      },
    });
    if (!post) return NextResponse.json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
    return NextResponse.json({ post });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });

    const { id } = await params;
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return NextResponse.json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
    if (post.authorId !== session.userId) {
      return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
    }

    const { title, content, imageUrl, tags } = await req.json();

    const tagRecords = await Promise.all(
      (tags ?? []).map((t: string) =>
        prisma.tag.upsert({ where: { name: t }, create: { name: t }, update: {} })
      )
    );

    const updated = await prisma.post.update({
      where: { id },
      data: {
        ...(title ? { title } : {}),
        ...(content !== undefined ? { content } : {}),
        ...(imageUrl ? { imageUrl } : {}),
        tags: { set: tagRecords.map((t) => ({ id: t.id })) },
      },
      include: {
        author: { select: { id: true, nickname: true, avatarUrl: true } },
        tags: true,
      },
    });

    return NextResponse.json({ post: updated });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });

    const { id } = await params;
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return NextResponse.json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
    if (post.authorId !== session.userId) {
      return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
    }

    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ message: '삭제 완료' });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
