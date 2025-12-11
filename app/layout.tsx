import type { Metadata } from 'next';
import localFont from 'next/font/local';
import 'antd/dist/reset.css';
import './globals.css';
import { Providers } from '@/app/providers';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Mini User Dashboard',
  description:
    'Kullanıcı listesi, arama, ekleme ve detay yönetimi için mini panel.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
