'use client';

import { useEffect, useState } from 'react';
import BannerCarousel from '@/components/home/BannerCarousel';
import StatsCards from '@/components/home/StatsCards';
import RecentActivity from '@/components/home/RecentActivity';
import GuildIntro from '@/components/home/GuildIntro';
import styles from './page.module.css';

interface Banner {
  id: string;
  imageUrl: string;
  title: string | null;
  linkUrl: string | null;
}

interface Stats {
  memberCount: number;
  onlineCount: number;
  todayPostCount: number;
}

interface RecentPost {
  id: string;
  title: string;
  content: string | null;
  createdAt: string;
  author: { id: string; nickname: string };
  tags: { name: string }[];
}

interface HomeData {
  banners: Banner[];
  stats: Stats;
  recentPosts: RecentPost[];
}

export default function HomePage() {
  const [data, setData] = useState<HomeData | null>(null);

  useEffect(() => {
    fetch('/api/home')
      .then((res) => res.json())
      .then(setData)
      .catch(() => {});
  }, []);

  return (
    <div className={`container ${styles.page}`}>
      {/* 배너 캐러셀 */}
      <section className={styles.banner}>
        <BannerCarousel banners={data?.banners ?? []} />
      </section>

      {/* 통계 카드 */}
      <section className={styles.stats}>
        <StatsCards stats={data?.stats ?? null} />
      </section>

      {/* 최근 활동 + 길드 소개 */}
      <section className={styles.bottom}>
        <RecentActivity posts={data?.recentPosts ?? []} />
        <GuildIntro />
      </section>
    </div>
  );
}
