'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Post } from '@/types';
import PostCard from '@/components/post/PostCard';
import Lightbox from '@/components/ui/Lightbox';
import styles from './page.module.css';

export default function MyPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuthStore();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // 내 게시물을 가져오기 위해 /api/posts를 이용하는데, 별도 엔드포인트가 없으므로
  // 원래라면 myposts API가 필요하지만 클라이언트에서 authorId 필터링 기능이 API에 있어야 합니다.
  // 여기서는 프론트에서 임시로 search 파라미터를 사용하거나 별도 구현을 가정하고,
  // 실제로는 백엔드의 getPosts를 수정하거나 /api/myposts 를 만들어야 할 수 있습니다.
  // (현재 주어진 API 구조에서는 모든 게시글을 불러온 뒤 클라이언트에서 필터링하거나 새로 추가해야 합니다)
  // 편의상 새로운 API를 작성하는 대신, 현재의 작성된 API를 사용하기 위해 
  // 여기서는 단순화하여 /api/posts 에서 search 값으로 본인 닉네임을 검색하는 방식을 fallback으로 둡니다.
  // 완벽한 구현을 위해 바로 다음 단계에서 /api/mypage/route.ts 를 추가하겠습니다.

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
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user, page, search]);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    } else {
      fetchMyPosts();
    }
  }, [isLoggedIn, router, fetchMyPosts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  if (!isLoggedIn || !user) return null;

  return (
    <div className={styles.page}>
      <Lightbox />

      <section className={styles.header}>
        <div className={styles.profile}>
          <div className={styles.avatar}>{user.nickname.charAt(0)}</div>
          <div>
            <h1 className={styles.nickname}>{user.nickname}</h1>
            <p className={styles.username}>@{user.username}</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className={styles.search}>
          <input
            className="input"
            type="text"
            placeholder="내 자랑 검색..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">검색</button>
        </form>
      </section>

      <section className="container section">
        <h2 className={styles.sectionTitle}>내가 쓴 자랑 글</h2>
        
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
      </section>
    </div>
  );
}
