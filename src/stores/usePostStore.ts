'use client';

import { create } from 'zustand';
import type { Post } from '@/types';

interface PostState {
  posts: Post[];
  selectedTag: string | null;
  searchQuery: string;
  currentPage: number;
  totalPages: number;
  setPosts: (posts: Post[]) => void;
  appendPosts: (posts: Post[]) => void;
  setSelectedTag: (tag: string | null) => void;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  setTotalPages: (total: number) => void;
  resetFeed: () => void;
}

export const usePostStore = create<PostState>((set) => ({
  posts: [],
  selectedTag: null,
  searchQuery: '',
  currentPage: 1,
  totalPages: 1,
  setPosts: (posts) => set({ posts }),
  appendPosts: (posts) => set((state) => ({ posts: [...state.posts, ...posts] })),
  setSelectedTag: (tag) => set({ selectedTag: tag, currentPage: 1 }),
  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setTotalPages: (total) => set({ totalPages: total }),
  resetFeed: () => set({ posts: [], currentPage: 1, totalPages: 1 }),
}));
