'use client';

import { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useUIStore } from '@/stores/useUIStore';
import styles from './Lightbox.module.css';

export default function Lightbox() {
  const { lightboxImage, isLightboxOpen, closeLightbox } = useUIStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
    },
    [closeLightbox]
  );

  useEffect(() => {
    if (isLightboxOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isLightboxOpen, handleKeyDown]);

  if (!isLightboxOpen || !lightboxImage) return null;

  return (
    <div className={styles.overlay} onClick={closeLightbox} role="dialog" aria-modal="true">
      <button className={styles.close} onClick={closeLightbox} aria-label="닫기">
        ✕
      </button>
      <div className={styles.imageWrap} onClick={(e) => e.stopPropagation()}>
        <Image
          src={lightboxImage}
          alt="원본 이미지"
          fill
          className={styles.image}
          sizes="100vw"
          priority
        />
      </div>
    </div>
  );
}
