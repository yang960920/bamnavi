'use client';

import Link from 'next/link';
import styles from './RecentActivity.module.css';

interface RecentPost {
  id: string;
  title: string;
  content: string | null;
  author: { nickname: string };
  tags: { name: string }[];
}

interface Props {
  posts: RecentPost[];
}

export default function RecentActivity({ posts }: Props) {
  return (
    <div className={`card ${styles.panel}`}>
      <h2 className={styles.title}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        최근 활동
      </h2>
      <div className={styles.list}>
        {posts.length === 0 ? (
          <p className={styles.empty}>아직 활동이 없어요.</p>
        ) : (
          posts.map((post) => (
            <Link key={post.id} href={`/post/${post.id}`} className={styles.item}>
              <div className={styles.meta}>
                <span className={styles.nickname}>{post.author.nickname}</span>
                {post.tags?.[0] && (
                  <span className={styles.channel}>{post.tags[0].name}</span>
                )}
              </div>
              <p className={styles.content}>
                {post.title} {post.content ?? ''}
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
