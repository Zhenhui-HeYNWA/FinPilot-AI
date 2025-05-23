import './globals.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import Nav from '@/components/nav/nav';

import UserSyncClient from '@/components/UserSyncClient';
import Providers from './provider/provider';
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Finpilot',
  description: 'Finpilot',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <Nav />
          <UserSyncClient />
          {children}
          <Toaster
            position='bottom-center'
            reverseOrder={false}
          />
        </Providers>
      </body>
    </html>
  );
}
