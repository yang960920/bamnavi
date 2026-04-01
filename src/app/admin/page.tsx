'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

interface Banner {
  id: string;
  imageUrl: string;
  title: string | null;
  linkUrl: string | null;
  order: number;
  active: boolean;
  createdAt: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  // 업로드 폼 상태
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // 관리자 세션 확인 → 없으면 로그인 페이지로 리다이렉트
  useEffect(() => {
    fetch('/api/admin/session')
      .then((res) => res.json())
      .then((data) => {
        if (!data.isAdmin) {
          router.replace('/admin/login');
          return;
        }
        // 관리자 인증 완료 → 배너 목록 로드
        return fetch('/api/admin/banners')
          .then((res) => res.json())
          .then((bannerData) => setBanners(bannerData));
      })
      .catch(() => router.replace('/admin/login'))
      .finally(() => setLoading(false));
  }, [router]);

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
  };

  // 배너 업로드
  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (title) formData.append('title', title);
      if (linkUrl) formData.append('linkUrl', linkUrl);

      const res = await fetch('/api/admin/banners', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || '업로드에 실패했습니다.');
        return;
      }

      const newBanner = await res.json();
      setBanners((prev) => [...prev, newBanner]);

      // 폼 초기화
      setFile(null);
      setPreviewUrl(null);
      setTitle('');
      setLinkUrl('');
      if (fileRef.current) fileRef.current.value = '';
    } catch {
      alert('업로드 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  // 활성/비활성 토글
  const handleToggle = async (id: string) => {
    const updated = banners.map((b) =>
      b.id === id ? { ...b, active: !b.active } : b
    );
    setBanners(updated);

    await fetch('/api/admin/banners', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        banners: updated.map((b, i) => ({ id: b.id, order: i, active: b.active })),
      }),
    });
  };

  // 순서 이동
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= banners.length) return;

    const updated = [...banners];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setBanners(updated);

    await fetch('/api/admin/banners', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        banners: updated.map((b, i) => ({ id: b.id, order: i, active: b.active })),
      }),
    });
  };

  // 배너 삭제
  const handleDelete = async (id: string) => {
    if (!confirm('이 배너를 삭제하시겠습니까?')) return;

    const res = await fetch('/api/admin/banners', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setBanners((prev) => prev.filter((b) => b.id !== id));
    }
  };

  if (loading) {
    return <div className={`container ${styles.loading}`}>로딩 중...</div>;
  }

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.header}>
        <h1 className={`gradient-text ${styles.title}`}>배너 관리</h1>
      </div>

      {/* 이미지 가이드 */}
      <div className={styles.guide}>
        <strong>배너 이미지 가이드</strong><br />
        - 권장 크기: <strong>1200 x 450px</strong> (비율 16:6)<br />
        - 지원 형식: JPG, PNG, WebP, GIF<br />
        - 최대 파일 크기: <strong>10MB</strong><br />
        - 너무 크거나 작은 이미지는 자동으로 잘려서 표시됩니다.
      </div>

      {/* 업로드 폼 */}
      <div className={styles.uploadForm}>
        <h2 className={styles.formTitle}>새 배너 등록</h2>

        <div className={styles.formGrid}>
          {/* 파일 선택 */}
          <div className={styles.fileInput}>
            <label
              className={`${styles.fileLabel} ${file ? styles.fileLabelActive : ''}`}
              htmlFor="banner-file"
            >
              {file ? `${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB)` : '클릭하여 배너 이미지를 선택하세요'}
            </label>
            <input
              id="banner-file"
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>

          {/* 미리보기 */}
          {previewUrl && (
            <div className={styles.preview}>
              <Image
                src={previewUrl}
                alt="미리보기"
                fill
                className={styles.previewImage}
              />
            </div>
          )}

          {/* 제목 */}
          <input
            type="text"
            className="input"
            placeholder="배너 제목 (선택)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* 링크 URL */}
          <input
            type="text"
            className="input"
            placeholder="클릭 시 이동할 URL (선택)"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
          />
        </div>

        <div className={styles.formActions}>
          <button
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? '업로드 중...' : '배너 등록'}
          </button>
        </div>
      </div>

      {/* 배너 목록 */}
      <h2 className={styles.listTitle}>등록된 배너 ({banners.length}개)</h2>

      {banners.length === 0 ? (
        <div className={styles.empty}>등록된 배너가 없습니다.</div>
      ) : (
        <div className={styles.bannerList}>
          {banners.map((banner, index) => (
            <div key={banner.id} className={styles.bannerItem}>
              <div className={styles.bannerThumb}>
                <Image
                  src={banner.imageUrl}
                  alt={banner.title || '배너'}
                  fill
                  className={styles.thumbImage}
                />
              </div>

              <div className={styles.bannerInfo}>
                <div className={styles.bannerInfoTitle}>
                  {banner.title || '(제목 없음)'}
                </div>
                <div className={styles.bannerInfoMeta}>
                  순서: {index + 1} | {new Date(banner.createdAt).toLocaleDateString('ko-KR')}
                </div>
              </div>

              <div className={styles.bannerActions}>
                <div className={styles.orderBtns}>
                  <button
                    className={styles.orderBtn}
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                  >
                    ▲
                  </button>
                  <button
                    className={styles.orderBtn}
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === banners.length - 1}
                  >
                    ▼
                  </button>
                </div>

                <button
                  className={`${styles.toggleBtn} ${banner.active ? styles.toggleActive : styles.toggleInactive}`}
                  onClick={() => handleToggle(banner.id)}
                >
                  {banner.active ? '활성' : '비활성'}
                </button>

                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(banner.id)}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
