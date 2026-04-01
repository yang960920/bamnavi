'use client';

import { create } from 'zustand';

interface UIState {
  lightboxImage: string | null;
  isLightboxOpen: boolean;
  openLightbox: (imageUrl: string) => void;
  closeLightbox: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  lightboxImage: null,
  isLightboxOpen: false,
  openLightbox: (imageUrl) => set({ lightboxImage: imageUrl, isLightboxOpen: true }),
  closeLightbox: () => set({ lightboxImage: null, isLightboxOpen: false }),
}));
