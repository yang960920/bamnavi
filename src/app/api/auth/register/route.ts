import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
import { createSession, COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { username, password, nickname } = await req.json();

    if (!username || !password || !nickname) {
      return NextResponse.json({ error: '紐⑤뱺 ?꾨뱶瑜??낅젰?댁＜?몄슂.' }, { status: 400 });
    }

    if (username.length < 3 || username.length > 20) {
      return NextResponse.json({ error: '?꾩씠?붾뒗 3~20?먯뿬???⑸땲??' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: '鍮꾨?踰덊샇??6???댁긽?댁뼱???⑸땲??' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return NextResponse.json({ error: '?대? ?ъ슜 以묒씤 ?꾩씠?붿엯?덈떎.' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { username, password: hashed, nickname },
    });

    const token = await createSession({ userId: user.id, username: user.username, nickname: user.nickname });

    const res = NextResponse.json({
      user: { id: user.id, username: user.username, nickname: user.nickname, avatarUrl: user.avatarUrl },
    });

    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: '?쒕쾭 ?ㅻ쪟媛 諛쒖깮?덉뒿?덈떎.' }, { status: 500 });
  }
}
