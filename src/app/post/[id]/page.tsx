import PostDetailClient from '@/components/post/PostDetail';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '게시글 상세 — 밤나비 길드',
};

export default function PostDetailPage() {
  return <PostDetailClient />;
}
