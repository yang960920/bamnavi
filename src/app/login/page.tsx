import LoginForm from '@/components/auth/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '로그인 — 밤나비 길드',
};

export default function LoginPage() {
  return <LoginForm />;
}
