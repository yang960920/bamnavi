'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUIStore } from '@/stores/useUIStore';
import type { Post } from '@/types';
import PostCard from '@/components/post/PostCard';
import Lightbox from '@/components/ui/Lightbox';
import styles from './page.module.css';

export default function HallOfFamePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [weekStart, setWeekStart] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/hall-of-fame')
      .then((r) => r.json())
      .then((d) => {
        setPosts(d.posts ?? []);
        setWeekStart(d.weekStart ?? '');
      })
      .finally(() => setLoading(false));
  }, []);

  const formatWeek = (d: string) => {
    if (!d) return '';
    const date = new Date(d);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 주`;
  };

  return (
    <div className={styles.page}>
      <Lightbox />

      <section className={styles.hero}>
        <div className={styles.crown}>👑</div>
        <h1 className={`gradient-text-vivid ${styles.title}`}>명예의 전당</h1>
        <p className={styles.sub}>{formatWeek(weekStart)} 주간 베스트 자랑</p>
      </section>

      <section className="container section">
        {loading ? (
          <div className={styles.grid}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`skeleton ${styles.skeletonCard}`} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className={styles.empty}>
            <span>🦋</span>
            <p>이번 주 자랑 게시글이 없어요.</p>
            <Link href="/post/new" className="btn btn-primary">첫 번째로 자랑하기</Link>
          </div>
        ) : (
          <>
            {/* 1위 강조 */}
            {posts[0] && (
              <div className={styles.topCard}>
                <div className={styles.topBadge}>🥇 1위</div>
                <PostCard post={posts[0]} />
              </div>
            )}
            {/* 2위~5위 그리드 */}
            <div className={styles.grid}>
              {posts.slice(1).map((post, i) => (
                <div key={post.id} className={styles.rankItem}>
                  <div className={styles.rankBadge}>{['🥈', '🥉', '4위', '5위'][i]}</div>
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
