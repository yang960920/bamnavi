export interface User {
  id: string;
  username: string;
  nickname: string;
  avatarUrl?: string | null;
  createdAt: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Author {
  id: string;
  nickname: string;
  avatarUrl?: string | null;
}

export interface Comment {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  createdAt: string;
  author: Author;
}

export interface ReactionCount {
  JEALOUS: number;
  STOP: number;
  CONGRATS: number;
}

export interface Post {
  id: string;
  title: string;
  content?: string | null;
  imageUrl: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author: Author;
  tags: Tag[];
  comments?: Comment[];
  reactions?: Reaction[];
  _count?: {
    comments: number;
    reactions: number;
  };
}

export interface Reaction {
  id: string;
  type: 'JEALOUS' | 'STOP' | 'CONGRATS';
  postId: string;
  userId: string;
  createdAt: string;
}

export const REACTION_LABELS: Record<string, string> = {
  JEALOUS: '기린이네...',
  STOP: '비틱 멈춰!',
  CONGRATS: 'ㅊㅊ / 부러워요',
};

export const REACTION_EMOJIS: Record<string, string> = {
  JEALOUS: '🦒',
  STOP: '🛑',
  CONGRATS: '🎉',
};

export const TAG_OPTIONS = [
  '태초',
  '커스텀/에픽',
  '아바타/룩',
  '레이드/업적',
  '일반/수다',
];
