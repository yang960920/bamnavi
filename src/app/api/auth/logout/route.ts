import { NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST() {
  const res = NextResponse.json({ message: '濡쒓렇?꾩썐 ?꾨즺' });
  res.cookies.delete(COOKIE_NAME);
  return res;
}
