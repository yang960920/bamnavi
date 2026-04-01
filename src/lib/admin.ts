import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'bamnavi-guild-secret-key-change-in-production'
);

const ADMIN_COOKIE = 'bamnavi_admin';

export interface AdminPayload {
  isAdmin: true;
}

/** 환경변수의 관리자 계정으로 인증 */
export function verifyAdminCredentials(username: string, password: string): boolean {
  const adminUser = process.env.ADMIN_USERNAME;
  const adminPass = process.env.ADMIN_PASSWORD;
  if (!adminUser || !adminPass) return false;
  return username === adminUser && password === adminPass;
}

/** 관리자 세션 토큰 생성 */
export async function createAdminSession(): Promise<string> {
  return new SignJWT({ isAdmin: true } as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(JWT_SECRET);
}

/** 관리자 세션 검증 */
export async function getAdminSession(): Promise<AdminPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.isAdmin) return { isAdmin: true };
    return null;
  } catch {
    return null;
  }
}

/** API 라우트에서 관리자 권한 확인 */
export async function requireAdmin(): Promise<boolean> {
  const session = await getAdminSession();
  return session?.isAdmin === true;
}

export { ADMIN_COOKIE };
