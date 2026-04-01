import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StarfieldBackground from '@/components/ui/StarfieldBackground';
import HeartbeatProvider from '@/components/HeartbeatProvider';

export const metadata: Metadata = {
  title: '밤나비 길드 — 자랑 게시판',
  description: '던전앤파이터 밤나비 길드의 득템·업적 자랑 게시판. 길드원들과 자유롭게 소통하세요.',
  keywords: ['밤나비', '밤나비길드', '던전앤파이터', 'DNF', '득템', '자랑', '길드'],
  openGraph: {
    title: '밤나비 길드 — 자랑 게시판',
    description: '던전앤파이터 밤나비 길드의 자랑 게시판',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <StarfieldBackground />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <HeartbeatProvider />
          <Header />
          <main style={{ flex: 1 }}>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
