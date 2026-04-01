'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/stores/useAuthStore';
import styles from './AuthForm.module.css';

export default function RegisterForm() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [form, setForm] = useState({ username: '', password: '', nickname: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
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
          <Image src="/images/logo.webp" alt="밤나비 길드" width={180} height={58} priority />
        </div>
        <h1 className={styles.title}>회원가입</h1>
        <p className={styles.sub}>밤나비 길드원으로 함께해요 🦋</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="form-group">
            <label className="label" htmlFor="reg-username">아이디</label>
            <input
              id="reg-username"
              className="input"
              type="text"
              placeholder="3~20자 영문/숫자"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label className="label" htmlFor="reg-nickname">길드 닉네임</label>
            <input
              id="reg-nickname"
              className="input"
              type="text"
              placeholder="인게임 닉네임을 입력하세요"
              value={form.nickname}
              onChange={(e) => setForm({ ...form, nickname: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="label" htmlFor="reg-password">비밀번호</label>
            <input
              id="reg-password"
              className="input"
              type="password"
              placeholder="6자 이상"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              autoComplete="new-password"
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? '가입 중...' : '가입하기'}
          </button>
        </form>

        <p className={styles.link}>
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className={styles.linkAnchor}>로그인</Link>
        </p>
      </div>
    </div>
  );
}
