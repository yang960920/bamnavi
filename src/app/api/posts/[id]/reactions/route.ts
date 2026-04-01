import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import type { ReactionType } from '@/generated/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });

    const { id: postId } = await params;
    const { type } = await req.json() as { type: ReactionType };

    const existing = await prisma.reaction.findUnique({
      where: { postId_userId_type: { postId, userId: session.userId, type } },
    });

    if (existing) {
      await prisma.reaction.delete({ where: { id: existing.id } });
      return NextResponse.json({ action: 'removed' });
    } else {
      const reaction = await prisma.reaction.create({
        data: { type, postId, userId: session.userId },
      });
      return NextResponse.json({ action: 'added', reaction }, { status: 201 });
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
