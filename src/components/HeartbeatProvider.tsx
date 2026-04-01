'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';

const HEARTBEAT_INTERVAL = 30_000; // 30초

export default function HeartbeatProvider() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) return;

    const send = () => {
      fetch('/api/heartbeat', { method: 'POST' }).catch(() => {});
    };

    // 즉시 1회 전송
    send();

    const timer = setInterval(send, HEARTBEAT_INTERVAL);
    return () => clearInterval(timer);
  }, [isLoggedIn]);

  return null;
}
