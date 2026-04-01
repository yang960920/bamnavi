import PostForm from '@/components/post/PostForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '자랑하기 — 밤나비 길드',
};

export default function NewPostPage() {
  return <PostForm />;
}
