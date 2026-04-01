'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@/types';
import { REACTION_EMOJIS, REACTION_LABELS } from '@/types';
import { useUIStore } from '@/stores/useUIStore';
import styles from './PostCard.module.css';

interface Props {
  post: Post;
}

export default function PostCard({ post }: Props) {
  const openLightbox = useUIStore((s) => s.openLightbox);

  const totalReactions = post._count?.reactions ?? 0;
  const totalComments = post._count?.comments ?? 0;

  const formatDate = (d: string) => {
    const date = new Date(d);
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / 1000;
    if (diff < 60) return '방금 전';
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  };

  return (
    <article className={`card ${styles.card}`}>
      {/* 이미지 */}
      <div className={styles.imageWrap} onClick={() => openLightbox(post.imageUrl)}>
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className={styles.image}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className={styles.imageOverlay}>
          <span className={styles.zoomHint}>🔍 클릭하여 확대</span>
        </div>
      </div>

      {/* 본문 */}
      <div className={styles.body}>
        {/* 태그 */}
        {post.tags.length > 0 && (
          <div className={styles.tags}>
            {post.tags.map((t) => (
              <span key={t.id} className="tag">
                {t.name}
              </span>
            ))}
          </div>
        )}

        {/* 제목 */}
        <Link href={`/post/${post.id}`} className={styles.title}>
          {post.title}
        </Link>

        {/* 내용 미리보기 */}
        {post.content && (
          <p className={styles.content}>{post.content}</p>
        )}

        {/* 하단 메타 */}
        <div className={styles.footer}>
          <div className={styles.author}>
            <div className={styles.avatar}>
              {post.author.nickname.charAt(0)}
            </div>
            <span>{post.author.nickname}</span>
            <span className={styles.dot}>·</span>
            <span className={styles.date}>{formatDate(post.createdAt)}</span>
          </div>

          <div className={styles.stats}>
            <span>💬 {totalComments}</span>
            {Object.entries(REACTION_EMOJIS).map(([k, emoji]) => (
              <span key={k} title={REACTION_LABELS[k]}>{emoji}</span>
            ))}
            <span>{totalReactions}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
