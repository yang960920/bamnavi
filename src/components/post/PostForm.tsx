'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import ImageUploader from '@/components/post/ImageUploader';
import { TAG_OPTIONS } from '@/types';
import styles from './PostForm.module.css';

export default function PostForm() {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const [form, setForm] = useState({ title: '', content: '', imageUrl: '', tags: [] as string[] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isLoggedIn) {
    return (
      <div className={styles.wrap}>
        <div className={styles.authNotice}>
          <p>게시글 작성은 로그인 후 이용 가능합니다.</p>
          <a href="/login" className="btn btn-primary">로그인하러 가기</a>
        </div>
      </div>
    );
  }

  const toggleTag = (t: string) => {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(t) ? f.tags.filter((x) => x !== t) : [...f.tags, t],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.imageUrl) { setError('이미지를 업로드해주세요.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      router.push(`/post/${data.post.id}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <h1 className={`gradient-text ${styles.title}`}>✨ 자랑하기</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="form-group">
            <label className="label">이미지 *</label>
            <ImageUploader value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="post-title">제목 *</label>
            <input
              id="post-title"
              className="input"
              type="text"
              placeholder="자랑 제목을 입력하세요"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="post-content">내용</label>
            <textarea
              id="post-content"
              className={`input textarea`}
              placeholder="자랑 내용을 입력하세요 (선택)"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              maxLength={2000}
            />
          </div>

          <div className="form-group">
            <label className="label">태그</label>
            <div className={styles.tags}>
              {TAG_OPTIONS.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`tag ${form.tags.includes(t) ? 'active' : ''}`}
                  onClick={() => toggleTag(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <button type="button" className="btn btn-ghost" onClick={() => router.back()}>취소</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '등록 중...' : '자랑 올리기 🦋'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
