'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Post } from '@/types';
import PostCard from '@/components/post/PostCard';
import styles from './MyPostsTab.module.css';

export default function MyPostsTab() {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchMyPosts = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (search) params.set('search', search);
      const res = await fetch(`/api/mypage?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setPosts(data.posts ?? []);
      setTotalPages(data.totalPages ?? 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user, page, search]);

  useEffect(() => {
    fetchMyPosts();
  }, [fetchMyPosts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div>
      <form onSubmit={handleSearch} className={styles.search}>
        <input
          className="input"
          type="text"
          placeholder="내 자랑 검색..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">검색</button>
        {search && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }}
          >
            초기화
          </button>
        )}
      </form>

      {loading ? (
        <div className={styles.grid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={`skeleton ${styles.skeletonCard}`} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className={styles.empty}>
          <p>작성한 자랑 게시글이 없습니다.</p>
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

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
        </>
      )}
    </div>
  );
}
