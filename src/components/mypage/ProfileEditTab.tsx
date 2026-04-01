'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import styles from './ProfileEditTab.module.css';

export default function ProfileEditTab() {
  const { user, setUser } = useAuthStore();
  const [nickname, setNickname] = useState(user?.nickname ?? '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const trimmed = nickname.trim();
    if (trimmed.length < 2 || trimmed.length > 20) {
      setMessage({ type: 'error', text: '닉네임은 2~20자여야 합니다.' });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/mypage/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '수정 실패');
      }
      setUser({ ...user, nickname: data.user.nickname });
      setMessage({ type: 'success', text: '닉네임이 변경되었습니다.' });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '수정 실패';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className={styles.wrap}>
      <div className={styles.profilePreview}>
        <div className={styles.avatar}>{user.nickname.charAt(0)}</div>
        <div>
          <p className={styles.currentNickname}>{user.nickname}</p>
          <p className={styles.username}>@{user.username}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className="form-group">
          <label className="label" htmlFor="nickname">닉네임 변경</label>
          <input
            id="nickname"
            className="input"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="새 닉네임 입력"
            maxLength={20}
          />
        </div>

        {message && (
          <p className={`${styles.message} ${message.type === 'success' ? styles.success : styles.error}`}>
            {message.text}
          </p>
        )}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? '저장 중...' : '저장'}
        </button>
      </form>
    </div>
  );
}
