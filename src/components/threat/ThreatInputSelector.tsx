'use client';

import { useState, useRef, useEffect } from 'react';
import { InvestigationInputType } from '@/types/investigation';
import {
  Link2,
  Image as ImageIcon,
  MessageSquare,
  Mail,
  QrCode,
  Upload,
  ArrowRight,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ThreatSubmitPayload {
  type: InvestigationInputType;
  content: string;
  metadata?: {
    title?: string;
    sender?: string;
    subject?: string;
    fileName?: string;
    detectedCategories?: string[];
  };
}

interface ThreatInputSelectorProps {
  onSubmit: (payload: ThreatSubmitPayload) => void;
  isLoading?: boolean;
}

const TABS: Array<{ type: InvestigationInputType; label: string; icon: any }> = [
  { type: 'url', label: 'URL', icon: Link2 },
  { type: 'screenshot', label: 'Screenshot', icon: ImageIcon },
  { type: 'message', label: 'Message', icon: MessageSquare },
  { type: 'email', label: 'Email', icon: Mail },
  { type: 'qr', label: 'QR Code', icon: QrCode },
];

export function ThreatInputSelector({ onSubmit, isLoading = false }: ThreatInputSelectorProps) {
  const [activeTab, setActiveTab] = useState<InvestigationInputType>('url');

  // URL state
  const [urlInput, setUrlInput] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);

  // Screenshot & Image state
  const [selectedFile, setSelectedFile] = useState<{ name: string; preview: string; category: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Message state
  const [messageText, setMessageText] = useState('');

  // Email state
  const [emailSender, setEmailSender] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // QR state
  const [qrDestination, setQrDestination] = useState('');
  const [qrFile, setQrFile] = useState<{ name: string; preview: string } | null>(null);
  const qrInputRef = useRef<HTMLInputElement>(null);

  // Handle incoming query parameters from Threat Feed or external links
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const demoType = params.get('demoType') as InvestigationInputType | null;
    const demoContent = params.get('demoContent');
    if (demoType && demoContent) {
      setActiveTab(demoType);
      if (demoType === 'url') setUrlInput(demoContent);
      if (demoType === 'message') setMessageText(demoContent);
      if (demoType === 'email') setEmailBody(demoContent);
      if (demoType === 'qr') setQrDestination(demoContent);
    }
  }, []);

  // Designated demo vectors clearly marked as demonstration data
  const DEMO_EXAMPLES = [
    {
      label: 'Fake delivery link',
      type: 'url' as InvestigationInputType,
      content: 'https://track-package.delivery-notice.example.net',
    },
    {
      label: 'Fake KYC message',
      type: 'message' as InvestigationInputType,
      content: 'URGENT: Your KYC status has expired. Complete identity verification at https://login-verify.example-auth.org/service within 24 hours to prevent account suspension.',
    },
    {
      label: 'Recruitment scam',
      type: 'message' as InvestigationInputType,
      content: 'Congratulations! Selected for Remote Project Specialist role ($55/hr). Verify identity and payment details at https://login-verify.example-auth.org/onboarding to claim position.',
    },
    {
      label: 'Suspicious APK message',
      type: 'message' as InvestigationInputType,
      content: 'Security Alert: Critical mobile banking security update. Download and install security-patch-v3.apk from https://track-package.delivery-notice.example.net/apk to maintain access.',
    },
    {
      label: 'Fake banking login',
      type: 'url' as InvestigationInputType,
      content: 'https://account-security.example-banking-alert.net/auth',
    },
  ];

  const handleUrlSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlInput.trim()) {
      setUrlError('Please enter a target URL to investigate.');
      return;
    }
    setUrlError(null);
    onSubmit({
      type: 'url',
      content: urlInput.trim(),
    });
  };

  const handleScreenshotSubmit = () => {
    if (!selectedFile) return;
    onSubmit({
      type: 'screenshot',
      content: selectedFile.preview || 'https://visual-evidence-capture.internal',
      metadata: {
        title: selectedFile.category,
        fileName: selectedFile.name,
      },
    });
  };

  const handleMessageSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageText.trim()) return;

    const detected: string[] = [];
    const lower = messageText.toLowerCase();
    if (lower.includes('urgent') || lower.includes('immediately') || lower.includes('within 24 hours')) detected.push('Urgency');
    if (lower.includes('congratulations') || lower.includes('winner') || lower.includes('selected')) detected.push('Social engineering');
    if (lower.includes('bank') || lower.includes('account') || lower.includes('postal')) detected.push('Impersonation');

    onSubmit({
      type: 'message',
      content: messageText.trim(),
      metadata: {
        detectedCategories: detected.length > 0 ? detected : ['Unverified text payload'],
      },
    });
  };

  const handleEmailSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!emailBody.trim()) return;

    onSubmit({
      type: 'email',
      content: emailBody.trim(),
      metadata: {
        sender: emailSender || 'external-origin@unverified.org',
        subject: emailSubject || 'Urgent Notification',
      },
    });
  };

  const handleQrSubmit = () => {
    const destination = qrDestination || 'https://track-package.delivery-notice.example.net/qr-pay';
    onSubmit({
      type: 'qr',
      content: destination,
      metadata: {
        title: 'QR Code Destination Analysis',
      },
    });
  };

  return (
    <div className="w-full space-y-4">
      {/* Primary Workstation Card */}
      <div className="rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#10151C] p-4 sm:p-5 shadow-2xl">
        {/* Tab switcher */}
        <div className="flex items-center gap-1 mb-4 pb-3 border-b border-[rgba(255,255,255,0.07)] overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.type;
            return (
              <button
                key={tab.type}
                type="button"
                onClick={() => setActiveTab(tab.type)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors shrink-0',
                  isActive
                    ? 'bg-[#141A22] text-[#F4F5F7] border border-[#7667E8]/35'
                    : 'text-[#A1A7B3] hover:text-[#F4F5F7] hover:bg-[#0B0F14]'
                )}
              >
                <Icon className={cn('h-3.5 w-3.5', isActive ? 'text-[#8B7CF6]' : 'text-[#69717F]')} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* URL Input */}
        {activeTab === 'url' && (
          <form onSubmit={handleUrlSubmit} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  if (urlError) setUrlError(null);
                }}
                placeholder="Paste a suspicious URL, message, or evidence…"
                className="w-full rounded-md border border-[rgba(255,255,255,0.07)] bg-[#0B0F14] px-3.5 py-2.5 text-[14px] md:text-[15px] text-[#E5E7EB] placeholder-[#69717F] focus:border-[#7667E8] focus:outline-none transition-colors font-mono"
              />
            </div>

            {urlError && (
              <div className="flex items-center gap-1.5 text-xs text-[#F05A5A] font-sans">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{urlError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !urlInput.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-md bg-[#7667E8] py-2.5 px-4 text-[14px] md:text-[15px] font-medium sm:font-semibold text-[#F5F6F8] hover:bg-[#8B7CF6] transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-sans"
            >
              <span>{isLoading ? 'Investigating…' : 'Investigate →'}</span>
            </button>
          </form>
        )}

        {/* Screenshot / Image Upload */}
        {activeTab === 'screenshot' && (
          <div className="space-y-3 font-sans">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setSelectedFile({
                    name: file.name,
                    preview: URL.createObjectURL(file),
                    category: 'User Uploaded Evidence Screenshot',
                  });
                }
              }}
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed border-[rgba(255,255,255,0.09)] hover:border-[#7667E8]/50 rounded-md p-6 text-center cursor-pointer bg-[#0B0F14] hover:bg-[#141A22] transition-colors space-y-2"
            >
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-md bg-[#10151C] border border-[rgba(255,255,255,0.07)] text-[#A1A7B3]">
                <Upload className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <div className="text-[14px] font-medium text-[#F5F6F8]">
                  {selectedFile ? selectedFile.name : 'Drop screenshot here, or browse file'}
                </div>
                <div className="text-[12px] text-[#69717F]">
                  Supports PNG, JPG, WebP. Payload isolated in memory.
                </div>
              </div>
            </div>

            {/* Quick Demo Screenshot Samples */}
            <div className="flex items-center gap-2 pt-1 overflow-x-auto">
              <span className="text-[11px] font-mono text-[#69717F] shrink-0 uppercase tracking-wider">Sample:</span>
              <button
                type="button"
                onClick={() =>
                  setSelectedFile({
                    name: 'phishing_login_mockup.png',
                    preview: '',
                    category: 'Deceptive Banking Auth Interface',
                  })
                }
                className="px-2.5 py-1 rounded-md text-[11px] font-mono border border-[rgba(255,255,255,0.07)] bg-[#0B0F14] text-[#A1A7B3] hover:text-[#F5F6F8] shrink-0 transition-colors"
              >
                Fake Bank Portal Screenshot
              </button>
            </div>

            <button
              type="button"
              disabled={!selectedFile || isLoading}
              onClick={handleScreenshotSubmit}
              className="w-full flex items-center justify-center gap-2 rounded-md bg-[#7667E8] py-2.5 px-4 text-[14px] md:text-[15px] font-medium sm:font-semibold text-[#F5F6F8] hover:bg-[#8B7CF6] transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-sans"
            >
              <span>{isLoading ? 'Investigating…' : 'Investigate →'}</span>
            </button>
          </div>
        )}

        {/* Message Input */}
        {activeTab === 'message' && (
          <form onSubmit={handleMessageSubmit} className="space-y-3 font-sans">
            <textarea
              rows={3}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Paste suspicious SMS, WhatsApp, Telegram, or Discord message..."
              className="w-full rounded-md border border-[rgba(255,255,255,0.07)] bg-[#0B0F14] p-3 text-[14px] md:text-[15px] text-[#E5E7EB] placeholder-[#69717F] focus:border-[#7667E8] focus:outline-none transition-colors"
            />

            <button
              type="submit"
              disabled={isLoading || !messageText.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-md bg-[#7667E8] py-2.5 px-4 text-[14px] md:text-[15px] font-medium sm:font-semibold text-[#F5F6F8] hover:bg-[#8B7CF6] transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-sans"
            >
              <span>{isLoading ? 'Investigating…' : 'Investigate →'}</span>
            </button>
          </form>
        )}

        {/* Email Input */}
        {activeTab === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-3 font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={emailSender}
                onChange={(e) => setEmailSender(e.target.value)}
                placeholder="Sender (e.g. security-alert@domain-check.cfd)"
                className="w-full rounded-md border border-[rgba(255,255,255,0.07)] bg-[#0B0F14] px-3 py-2 text-xs md:text-[13px] text-[#E5E7EB] placeholder-[#69717F] focus:border-[#7667E8] focus:outline-none font-mono"
              />
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Subject Line (e.g. Urgent: Account Restricted)"
                className="w-full rounded-md border border-[rgba(255,255,255,0.07)] bg-[#0B0F14] px-3 py-2 text-xs md:text-[13px] text-[#E5E7EB] placeholder-[#69717F] focus:border-[#7667E8] focus:outline-none"
              />
            </div>

            <textarea
              rows={3}
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              placeholder="Paste raw email body or suspicious email contents..."
              className="w-full rounded-md border border-[rgba(255,255,255,0.07)] bg-[#0B0F14] p-3 text-[14px] md:text-[15px] text-[#E5E7EB] placeholder-[#69717F] focus:border-[#7667E8] focus:outline-none"
            />

            <button
              type="submit"
              disabled={isLoading || !emailBody.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-md bg-[#7667E8] py-2.5 px-4 text-[14px] md:text-[15px] font-medium sm:font-semibold text-[#F5F6F8] hover:bg-[#8B7CF6] transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-sans"
            >
              <span>{isLoading ? 'Investigating…' : 'Investigate →'}</span>
            </button>
          </form>
        )}

        {/* QR Code Input */}
        {activeTab === 'qr' && (
          <div className="space-y-3 font-sans">
            <input
              type="file"
              ref={qrInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setQrFile({ name: file.name, preview: URL.createObjectURL(file) });
                  setQrDestination('https://track-package.delivery-notice.example.net/qr-pay');
                }
              }}
            />

            <div
              onClick={() => qrInputRef.current?.click()}
              className="border border-dashed border-[rgba(255,255,255,0.09)] hover:border-[#7667E8]/50 rounded-md p-6 text-center cursor-pointer bg-[#0B0F14] hover:bg-[#141A22] transition-colors space-y-2"
            >
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-md bg-[#10151C] border border-[rgba(255,255,255,0.07)] text-[#A1A7B3]">
                <QrCode className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <div className="text-[14px] font-medium text-[#F5F6F8]">
                  {qrFile ? qrFile.name : 'Upload QR screenshot or image to decode destination'}
                </div>
                <div className="text-[12px] text-[#69717F]">
                  Decodes target URL securely without camera or browser redirect.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 overflow-x-auto">
              <span className="text-[11px] font-mono text-[#69717F] shrink-0 uppercase tracking-wider">Sample:</span>
              <button
                type="button"
                onClick={() => {
                  setQrFile({ name: 'parking_quish.png', preview: '' });
                  setQrDestination('https://track-package.delivery-notice.example.net/qr-pay');
                }}
                className="px-2.5 py-1 rounded-md text-[11px] font-mono border border-[rgba(255,255,255,0.07)] bg-[#0B0F14] text-[#A1A7B3] hover:text-[#F5F6F8] shrink-0 transition-colors"
              >
                Quishing Parking QR
              </button>
            </div>

            <button
              type="button"
              disabled={!qrDestination || isLoading}
              onClick={handleQrSubmit}
              className="w-full flex items-center justify-center gap-2 rounded-md bg-[#7667E8] py-2.5 px-4 text-[14px] md:text-[15px] font-medium sm:font-semibold text-[#F5F6F8] hover:bg-[#8B7CF6] transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-sans"
            >
              <span>{isLoading ? 'Investigating…' : 'Investigate →'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Subtitle / Trust Architecture */}
      <div className="text-center text-[13px] text-[#69717F] font-sans">
        No account required · Open source · Evidence-based
      </div>

      {/* Try An Example (Demo Vectors) */}
      <div className="pt-2 space-y-2.5 font-sans">
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-[#69717F] uppercase tracking-wider">
          <span>TRY AN EXAMPLE</span>
          <span>·</span>
          <span className="text-[#8B7CF6]">DEMO VECTORS</span>
        </div>
        <div className="flex items-center justify-center flex-wrap gap-2 text-xs">
          {DEMO_EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              type="button"
              onClick={() => {
                setActiveTab(ex.type);
                if (ex.type === 'url') setUrlInput(ex.content);
                if (ex.type === 'message') setMessageText(ex.content);
                onSubmit({ type: ex.type, content: ex.content });
              }}
              className="px-2.5 py-1 rounded-md border border-[rgba(255,255,255,0.07)] bg-[#0B0F14] text-[#A1A7B3] hover:text-[#F5F6F8] hover:border-[rgba(255,255,255,0.16)] text-[12px] transition-colors font-mono"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
