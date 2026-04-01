'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import styles from './BannerCarousel.module.css';

interface Banner {
  id: string;
  imageUrl: string;
  title: string | null;
  linkUrl: string | null;
}

interface Props {
  banners: Banner[];
}

export default function BannerCarousel({ banners }: Props) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    if (banners.length === 0) return;
    setCurrent((c) => (c + 1) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, banners.length]);

  if (banners.length === 0) {
    return (
      <div className={styles.carousel}>
        <div className={styles.empty}>등록된 배너가 없습니다</div>
      </div>
    );
  }

  return (
    <div className={styles.carousel}>
      <div className={styles.track} style={{ transform: `translateX(-${current * 100}%)` }}>
        {banners.map((banner, i) => {
          const img = (
            <Image
              src={banner.imageUrl}
              alt={banner.title || `배너 ${i + 1}`}
              fill
              className={styles.image}
              priority={i === 0}
            />
          );

          if (banner.linkUrl) {
            return (
              <a key={banner.id} href={banner.linkUrl} target="_blank" rel="noopener noreferrer" className={styles.slide}>
                {img}
              </a>
            );
          }

          return (
            <div key={banner.id} className={styles.slide}>
              {img}
            </div>
          );
        })}
      </div>
      {banners.length > 1 && (
        <div className={styles.dots}>
          {banners.map((banner, i) => (
            <button
              key={banner.id}
              className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`배너 ${i + 1}로 이동`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
