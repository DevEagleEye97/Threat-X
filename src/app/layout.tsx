import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { BottomNav } from '@/components/layout/BottomNav';
import { Footer } from '@/components/layout/Footer';
import { ThreatMatrix } from '@/components/threat/ThreatMatrix';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'THREATX — Don\'t click it. Investigate it.',
  description:
    'Open-source Digital Threat Investigation Platform. Investigate suspicious URLs, screenshots, messages, emails, and QR codes safely before interaction.',
  openGraph: {
    title: 'THREATX — Don\'t click it. Investigate it.',
    description: 'Investigate suspicious digital content before interacting with it.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark bg-[#07090D] text-[#F5F6F8] antialiased`}>
      <body className="min-h-screen flex flex-col bg-[#07090D] text-[#F5F6F8] font-sans selection:bg-[#7667E8]/30 selection:text-[#F5F6F8] relative">
        {/* Skip to main content link — WCAG 2.2 AA keyboard navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[#7667E8] focus:text-white focus:rounded-lg focus:text-sm focus:font-medium focus:outline-none focus:ring-2 focus:ring-white"
        >
          Skip to main content
        </a>
        <ThreatMatrix />
        <Navbar />
        <main id="main-content" className="flex-1 relative z-10" role="main" aria-label="Investigation content">
          {children}
        </main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
