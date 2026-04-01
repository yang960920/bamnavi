'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/stores/useAuthStore';
import styles from './AuthForm.module.css';

export default function LoginForm() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setUser(data.user);
      router.push('/');
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.logoWrap}>
          <Image src="/images/logo.png" alt="밤나비 길드" width={240} height={240} priority />
        </div>
        <h1 className={styles.title}>로그인</h1>
        <p className={styles.sub}>밤나비 길드원만의 자랑 게시판</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="form-group">
            <label className="label" htmlFor="login-username">아이디</label>
            <input
              id="login-username"
              className="input"
              type="text"
              placeholder="아이디를 입력하세요"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label className="label" htmlFor="login-password">비밀번호</label>
            <input
              id="login-password"
              className="input"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <p className={styles.link}>
          아직 계정이 없으신가요?{' '}
          <Link href="/register" className={styles.linkAnchor}>회원가입</Link>
        </p>
      </div>
    </div>
  );
}
