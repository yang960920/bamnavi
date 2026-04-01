import RegisterForm from '@/components/auth/RegisterForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '회원가입 — 밤나비 길드',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
