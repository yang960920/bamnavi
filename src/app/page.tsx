'use client';

import { useEffect, useState, useCallback } from 'react';
import type { Post, Tag } from '@/types';
import { TAG_OPTIONS } from '@/types';
import PostCard from '@/components/post/PostCard';
import Lightbox from '@/components/ui/Lightbox';
import styles from './page.module.css';

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (selectedTag) params.set('tag', selectedTag);
      if (search) params.set('search', search);
      const res = await fetch(`/api/posts?${params.toString()}`);
      const data = await res.json();
      setPosts(data.posts ?? []);
      setTotalPages(data.totalPages ?? 1);
    } finally {
      setLoading(false);
    }
  }, [page, selectedTag, search]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleTagClick = (tag: string) => {
    setSelectedTag((prev) => (prev === tag ? null : tag));
    setPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className={styles.page}>
      <Lightbox />

      {/* 히어로 섹션 */}
      <section className={styles.hero}>
        <h1 className={`gradient-text ${styles.heroTitle}`}>
          🦋 밤나비 길드 자랑 피드
        </h1>
        <p className={styles.heroSub}>득템·업적·아바타 자랑은 여기서!</p>

        {/* 검색 */}
        <form onSubmit={handleSearch} className={styles.searchWrap}>
          <input
            className={`input ${styles.searchInput}`}
            type="text"
            placeholder="제목·내용 검색..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">검색</button>
          {search && (
            <button type="button" className="btn btn-ghost" onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }}>
              초기화
            </button>
          )}
        </form>
      </section>

      {/* 태그 필터 */}
      <section className={styles.tagBar}>
        <div className="container">
          <div className={styles.tags}>
            <button
              className={`tag ${!selectedTag ? 'active' : ''}`}
              onClick={() => { setSelectedTag(null); setPage(1); }}
            >
              전체
            </button>
            {TAG_OPTIONS.map((t) => (
              <button
                key={t}
                className={`tag ${selectedTag === t ? 'active' : ''}`}
                onClick={() => handleTagClick(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 게시글 그리드 */}
      <section className={`container section`}>
        {loading ? (
          <div className={styles.grid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`skeleton ${styles.skeletonCard}`} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🦋</span>
            <p>아직 자랑 게시글이 없어요.</p>
            <p className={styles.emptyHint}>첫 번째로 자랑해보세요!</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {posts.map((post, i) => (
              <div key={post.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <PostCard post={post} />
              </div>
            ))}
          </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              className="btn btn-ghost btn-sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ← 이전
            </button>
            <span className={styles.pageInfo}>{page} / {totalPages}</span>
            <button
              className="btn btn-ghost btn-sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              다음 →
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
