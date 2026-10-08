import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { BottomNav } from '@/components/layout/BottomNav';
import { Footer } from '@/components/layout/Footer';
import { ThreatMatrix } from '@/components/threat/ThreatMatrix';

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
    <html lang="en" className="dark bg-[#07090D] text-[#F5F7FA] antialiased">
      <body className="min-h-screen flex flex-col bg-[#07090D] text-[#F5F7FA] selection:bg-[#7C5CFF]/30 selection:text-[#F5F7FA] relative">
        <ThreatMatrix />
        <Navbar />
        <div className="flex-1 relative z-10">{children}</div>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
