'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@/types';
import { REACTION_EMOJIS, REACTION_LABELS } from '@/types';
import { useAuthStore } from '@/stores/useAuthStore';
import { useUIStore } from '@/stores/useUIStore';
import Lightbox from '@/components/ui/Lightbox';
import styles from './PostDetail.module.css';

type ReactionType = 'JEALOUS' | 'STOP' | 'CONGRATS';

export default function PostDetailClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isLoggedIn } = useAuthStore();
  const openLightbox = useUIStore((s) => s.openLightbox);

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then((r) => r.json())
      .then((d) => setPost(d.post))
      .finally(() => setLoading(false));
  }, [id]);

  const handleReaction = async (type: ReactionType) => {
    if (!isLoggedIn || !user) { alert('로그인이 필요합니다.'); return; }
    const res = await fetch(`/api/posts/${id}/reactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type }),
    });
    if (res.ok && post) {
      const { action } = await res.json();
      const reactions = post.reactions ?? [];
      setPost({
        ...post,
        reactions: action === 'removed'
          ? reactions.filter((r) => !(r.userId === user.id && r.type === type))
          : [...reactions, { id: crypto.randomUUID(), type, postId: id, userId: user.id, createdAt: new Date().toISOString() }],
      });
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentText }),
      });
      if (res.ok && post) {
        const { comment } = await res.json();
        setCommentText('');
        setPost({
          ...post,
          comments: [...(post.comments ?? []), comment],
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('게시글을 삭제할까요?')) return;
    const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    if (res.ok) router.push('/');
  };

  if (loading) return <div className={styles.loading}><div className={`skeleton ${styles.skeleton}`} /></div>;
  if (!post) return <div className={styles.notFound}>게시글을 찾을 수 없습니다.</div>;

  const myReactions = post.reactions?.filter((r) => r.userId === user?.id).map((r) => r.type) ?? [];
  const reactionCounts = (Object.keys(REACTION_EMOJIS) as ReactionType[]).map((type) => ({
    type,
    count: post.reactions?.filter((r) => r.type === type).length ?? 0,
    mine: myReactions.includes(type),
  }));

  return (
    <div className={styles.page}>
      <Lightbox />
      <div className="container">
        <Link href="/" className={`btn btn-ghost btn-sm ${styles.back}`}>← 피드로 돌아가기</Link>

        <article className={styles.article}>
          {/* 이미지 */}
          <div className={styles.imageWrap} onClick={() => openLightbox(post.imageUrl)}>
            <Image src={post.imageUrl} alt={post.title} fill className={styles.image} sizes="100vw" />
            <div className={styles.imageOverlay}><span>🔍 클릭하여 원본 보기</span></div>
          </div>

          {/* 본문 */}
          <div className={styles.content}>
            {/* 태그 */}
            <div className={styles.tags}>
              {post.tags.map((t) => <span key={t.id} className="tag">{t.name}</span>)}
            </div>

            {/* 제목 */}
            <h1 className={styles.title}>{post.title}</h1>

            {/* 작성자 정보 */}
            <div className={styles.meta}>
              <div className={styles.avatar}>{post.author.nickname.charAt(0)}</div>
              <span className={styles.nickname}>{post.author.nickname}</span>
              <span>·</span>
              <span className={styles.date}>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
              {user?.id === post.authorId && (
                <div className={styles.ownerActions}>
                  <button className="btn btn-ghost btn-sm" onClick={() => router.push(`/post/edit/${id}`)}>수정</button>
                  <button className="btn btn-danger btn-sm" onClick={handleDelete}>삭제</button>
                </div>
              )}
            </div>

            <hr className="divider" />

            {/* 내용 */}
            {post.content && <p className={styles.body}>{post.content}</p>}

            {/* 리액션 */}
            <div className={styles.reactions}>
              {reactionCounts.map(({ type, count, mine }) => (
                <button
                  key={type}
                  className={`${styles.reactionBtn} ${mine ? styles.reactionActive : ''}`}
                  onClick={() => handleReaction(type)}
                  title={REACTION_LABELS[type]}
                >
                  <span>{REACTION_EMOJIS[type]}</span>
                  <span>{REACTION_LABELS[type]}</span>
                  <span className={styles.reactionCount}>{count}</span>
                </button>
              ))}
            </div>
          </div>
        </article>

        {/* 댓글 */}
        <section className={styles.commentSection}>
          <h2 className={styles.commentTitle}>댓글 {post.comments?.length ?? 0}개</h2>

          {isLoggedIn && (
            <form onSubmit={handleComment} className={styles.commentForm}>
              <input
                className="input"
                placeholder="댓글을 입력하세요..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
                {submitting ? '...' : '등록'}
              </button>
            </form>
          )}

          <div className={styles.commentList}>
            {post.comments?.map((c) => (
              <div key={c.id} className={styles.comment}>
                <div className={styles.commentAvatar}>{c.author.nickname.charAt(0)}</div>
                <div>
                  <div className={styles.commentMeta}>
                    <strong>{c.author.nickname}</strong>
                    <span>{new Date(c.createdAt).toLocaleDateString('ko-KR')}</span>
                  </div>
                  <p className={styles.commentBody}>{c.content}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
