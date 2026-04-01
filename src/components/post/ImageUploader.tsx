'use client';

import { useCallback, useState } from 'react';
import styles from './ImageUploader.module.css';

interface Props {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUploader({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || '');
  const [drag, setDrag] = useState(false);

  const upload = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPreview(data.url);
      onChange(data.url);
    } catch (e) {
      alert((e as Error).message || '업로드 실패');
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  const handleFile = (file: File | null | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('이미지 파일만 업로드 가능합니다.'); return; }
    upload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className={styles.wrap}>
      <div
        className={`${styles.dropzone} ${drag ? styles.dragging : ''} ${preview ? styles.hasPrev : ''}`}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onClick={() => document.getElementById('imageInput')?.click()}
      >
        {uploading ? (
          <div className={styles.uploading}>
            <div className={styles.spinner} />
            <span>업로드 중...</span>
          </div>
        ) : preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="미리보기" className={styles.preview} />
        ) : (
          <div className={styles.placeholder}>
            <span className={styles.icon}>📸</span>
            <span className={styles.hint}>이미지를 드래그하거나 클릭하여 업로드</span>
            <span className={styles.sub}>PNG, JPG, WEBP · 최대 10MB</span>
          </div>
        )}
      </div>
      <input
        id="imageInput"
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {preview && (
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setPreview(''); onChange(''); }}>
          이미지 변경
        </button>
      )}
    </div>
  );
}
