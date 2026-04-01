'use client';

import styles from './StatsCards.module.css';

interface Stats {
  memberCount: number;
  onlineCount: number;
  todayPostCount: number;
}

interface Props {
  stats: Stats | null;
}

export default function StatsCards({ stats }: Props) {
  const items = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
      label: '현재접속 인원',
      value: stats?.onlineCount ?? '-',
      unit: '명',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="18" x2="12" y2="12" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
      ),
      label: '오늘 등록된 게시글',
      value: stats?.todayPostCount ?? '-',
      unit: '건',
    },
  ];

  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <div key={item.label} className={`card ${styles.card}`}>
          <span className={styles.icon}>{item.icon}</span>
          <div>
            <p className={styles.label}>{item.label}</p>
            <p className={styles.value}>
              {item.value}
              <span className={styles.unit}>{item.unit}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
