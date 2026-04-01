'use client';

import { GUILD_DESCRIPTION, GUILD_REQUIREMENTS } from '@/constants/guild';
import styles from './GuildIntro.module.css';

export default function GuildIntro() {
  return (
    <div className={`card ${styles.panel}`}>
      <h2 className={styles.title}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
        길드 소개
      </h2>

      <div className={styles.description}>
        {GUILD_DESCRIPTION.split('\n\n').map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className={styles.requirements}>
        <h3 className={styles.reqTitle}>가입 조건</h3>
        <ul className={styles.reqList}>
          {GUILD_REQUIREMENTS.map((req, i) => (
            <li key={i} className={styles.reqItem}>· {req}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
