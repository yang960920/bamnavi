import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <Image
            src="/images/logo.webp"
            alt="밤나비 길드"
            width={100}
            height={32}
            className={styles.logo}
          />
          <p className={styles.desc}>
            던전앤파이터 밤나비 길드 공식 자랑 게시판
          </p>
        </div>
        <nav className={styles.links}>
          <Link href="/">자랑 피드</Link>
          <Link href="/hall-of-fame">명예의 전당</Link>
          <Link href="/login">로그인</Link>
          <Link href="/register">회원가입</Link>
        </nav>
        <p className={styles.copy}>© 2025 BAMNAVI GUILD. All rights reserved.</p>
      </div>
    </footer>
  );
}
