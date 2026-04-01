import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getAdminSession();
  return NextResponse.json({ isAdmin: session?.isAdmin === true });
}
