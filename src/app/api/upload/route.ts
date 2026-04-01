import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: '濡쒓렇?몄씠 ?꾩슂?⑸땲??' }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) return NextResponse.json({ error: '?뚯씪???놁뒿?덈떎.' }, { status: 400 });

    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: '?뚯씪 ?ш린??10MB ?댄븯留?媛?ν빀?덈떎.' }, { status: 400 });
    }

    const blob = await put(`posts/${Date.now()}-${file.name}`, file, { access: 'public' });
    return NextResponse.json({ url: blob.url });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: '?낅줈???ㅽ뙣' }, { status: 500 });
  }
}
