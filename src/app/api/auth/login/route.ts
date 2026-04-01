import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
import { createSession, COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: '?꾩씠?붿? 鍮꾨?踰덊샇瑜??낅젰?댁＜?몄슂.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return NextResponse.json({ error: '?꾩씠???먮뒗 鍮꾨?踰덊샇媛 ?щ컮瑜댁? ?딆뒿?덈떎.' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: '?꾩씠???먮뒗 鍮꾨?踰덊샇媛 ?щ컮瑜댁? ?딆뒿?덈떎.' }, { status: 401 });
    }

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
