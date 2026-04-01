'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import Lightbox from '@/components/ui/Lightbox';
import MyPostsTab from '@/components/mypage/MyPostsTab';
import ProfileEditTab from '@/components/mypage/ProfileEditTab';
import GameInfoTab from '@/components/mypage/GameInfoTab';
import styles from './page.module.css';

type TabKey = 'posts' | 'profile' | 'game';

const TABS: { key: TabKey; label: string; disabled?: boolean }[] = [
  { key: 'posts', label: '내가 쓴 글' },
  { key: 'profile', label: '프로필 수정' },
  { key: 'game', label: '게임정보', disabled: true },
];

export default function MyPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabKey>('posts');

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  const handleTabClick = (tab: typeof TABS[number]) => {
    if (tab.disabled) {
      alert('구현중입니다');
      return;
    }
    setActiveTab(tab.key);
  };

  if (!isLoggedIn || !user) return null;

  return (
    <div className={styles.page}>
      <Lightbox />

      {/* 프로필 헤더 */}
      <section className={styles.profileHeader}>
        <div className={styles.avatar}>{user.nickname.charAt(0)}</div>
        <div>
          <h1 className={styles.nickname}>{user.nickname}</h1>
          <p className={styles.username}>@{user.username}</p>
        </div>
      </section>

      {/* 사이드바 + 콘텐츠 */}
      <div className={styles.layout}>
        <nav className={styles.sidebar}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tabButton} ${activeTab === tab.key ? styles.tabActive : ''} ${tab.disabled ? styles.tabDisabled : ''}`}
              onClick={() => handleTabClick(tab)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <main className={styles.content}>
          {activeTab === 'posts' && <MyPostsTab />}
          {activeTab === 'profile' && <ProfileEditTab />}
          {activeTab === 'game' && <GameInfoTab />}
        </main>
      </div>
    </div>
  );
}
