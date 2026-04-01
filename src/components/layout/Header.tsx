'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import styles from './Header.module.css';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoggedIn, clearUser } = useAuthStore();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    clearUser();
    router.push('/');
    router.refresh();
  };

  const nav = [
    { href: '/', label: '자랑 피드' },
    { href: '/hall-of-fame', label: '명예의 전당' },
  ];

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        {/* 로고 */}
        <Link href="/" className={styles.logo}>
          <Image
            src="/images/logo.png"
            alt="밤나비 길드"
            width={80}
            height={80}
            priority
            className={styles.logoImg}
          />
        </Link>

        {/* 네비게이션 */}
        <nav className={styles.nav}>
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`${styles.navLink} ${pathname === n.href ? styles.active : ''}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* 우측 액션 */}
        <div className={styles.actions}>
          {isLoggedIn ? (
            <>
              <Link href="/post/new" className="btn btn-primary btn-sm">
                + 자랑하기
              </Link>
              <Link href="/mypage" className={styles.navLink}>
                {user?.nickname}
              </Link>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm">
                로그인
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
