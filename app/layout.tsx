import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import 'antd/dist/reset.css';
import './globals.css';
import { Providers } from '@/app/providers';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { Space } from 'antd';

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
  const themeInitScript = `
    (function() {
      var storageKey = 'akilli-ticaret:theme';
      var classList = document.documentElement.classList;
      var stored = null;
      try {
        stored = localStorage.getItem(storageKey);
      } catch (err) {}
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var theme = stored === 'light' || stored === 'dark' ? stored : (prefersDark ? 'dark' : 'light');
      classList.remove('light','dark');
      classList.add(theme);
      document.documentElement.style.colorScheme = theme;
    })();
  `;

  return (
    <html lang="tr" suppressHydrationWarning className="light" data-theme="light">
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="mx-auto flex max-w-6xl flex-col gap-4 pt-4 pr-10">
            <Space align="center" className="justify-end w-full" wrap>
              <div>
                <ThemeToggle />
              </div>
            </Space>
          </div>
          {children}
        </Providers>
      </body>
    </html>
  );
}
