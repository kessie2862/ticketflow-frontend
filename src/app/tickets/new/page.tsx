'use client';

import { useState } from 'react';
import { useCloudinaryUpload } from '@/hooks/useCloudinaryUpload';
import { useTickets } from '@/hooks/useTickets';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  UploadCloud,
  Loader2,
  Info,
  CheckCircle2,
  AlertTriangle,
  FileText,
  MousePointer2,
  TicketCheck,
} from 'lucide-react';
import Link from 'next/link';
import { Priority } from '@/types';

export default function NewTicket() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState<Priority>('LOW');
  const [file, setFile] = useState<File | null>(null);

  const { uploadImage, uploading: isUploadingImage } = useCloudinaryUpload();
  const router = useRouter();

  const { useCreateTicket } = useTickets();
  const { mutate: createTicket, isPending: isCreatingTicket } =
    useCreateTicket();

  const isSubmitting = isUploadingImage || isCreatingTicket;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let attachmentUrl = null;

    if (file) {
      try {
        attachmentUrl = await uploadImage(file);
      } catch {
        return;
      }
    }

    createTicket(
      { title, description: desc, priority, attachment_url: attachmentUrl },
      { onSuccess: () => router.push('/dashboard') },
    );
  };

  const priorityOptions = [
    {
      id: 'LOW',
      label: 'Low',
      dotColor: '#94a3b8',
      activeColor: 'rgba(148,163,184,0.15)',
      activeBorder: 'rgba(148,163,184,0.4)',
      activeText: '#94a3b8',
    },
    {
      id: 'MEDIUM',
      label: 'Medium',
      dotColor: '#fbbf24',
      activeColor: 'rgba(251,191,36,0.12)',
      activeBorder: 'rgba(251,191,36,0.4)',
      activeText: '#fbbf24',
    },
    {
      id: 'HIGH',
      label: 'High',
      dotColor: '#f87171',
      activeColor: 'rgba(239,68,68,0.12)',
      activeBorder: 'rgba(239,68,68,0.4)',
      activeText: '#f87171',
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      {/* Navbar */}
      <nav
        className="sticky top-0 z-50"
        style={{
          background: 'rgba(10,10,15,0.90)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="group flex items-center gap-2 font-mono text-xs tracking-widest uppercase transition-colors"
            style={{ color: 'var(--muted)' }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = 'var(--accent)')
            }
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Back
          </Link>

          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded flex items-center justify-center"
              style={{ background: 'var(--accent)' }}
            >
              <TicketCheck className="w-3.5 h-3.5 text-black" />
            </div>
            <span
              className="font-mono text-[10px] tracking-[0.2em] uppercase"
              style={{ color: 'var(--muted)' }}
            >
              Drafting New Request
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            <header className="mb-10">
              <p
                className="font-mono text-xs tracking-[0.25em] uppercase mb-3"
                style={{ color: 'var(--accent)' }}
              >
                ◈ New Ticket
              </p>
              <h1
                className="font-display leading-none mb-4"
                style={{
                  color: 'var(--text)',
                  fontSize: 'clamp(2rem,6vw,4rem)',
                  letterSpacing: '0.04em',
                }}
              >
                OPEN A SUPPORT
                <br />
                <span style={{ color: 'var(--accent)' }}>TICKET</span>
              </h1>
              <p
                className="font-body text-sm leading-relaxed"
                style={{ color: 'var(--muted)' }}
              >
                Provide the details of your issue and our team will get right on
                it.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Subject */}
              <div className="space-y-3">
                <label
                  className="font-mono text-[10px] tracking-[0.2em] uppercase flex items-center gap-2"
                  style={{ color: 'var(--muted)' }}
                >
                  <FileText
                    className="w-3.5 h-3.5"
                    style={{ color: 'var(--accent)' }}
                  />
                  Issue Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Access denied to production database"
                  className="w-full p-4 rounded-xl outline-none transition-all font-body text-sm"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = 'rgba(198,241,53,0.4)')
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = 'var(--border)')
                  }
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Priority */}
              <div className="space-y-3">
                <label
                  className="font-mono text-[10px] tracking-[0.2em] uppercase flex items-center gap-2"
                  style={{ color: 'var(--muted)' }}
                >
                  <AlertTriangle
                    className="w-3.5 h-3.5"
                    style={{ color: '#fbbf24' }}
                  />
                  Urgency Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {priorityOptions.map((opt) => {
                    const isActive = priority === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setPriority(opt.id as Priority)}
                        className="p-4 rounded-xl font-mono text-xs tracking-widest uppercase flex flex-col items-center gap-2 transition-all"
                        style={{
                          background: isActive
                            ? opt.activeColor
                            : 'var(--surface)',
                          border: `1px solid ${isActive ? opt.activeBorder : 'var(--border)'}`,
                          color: isActive ? opt.activeText : 'var(--muted)',
                        }}
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ background: opt.dotColor }}
                        />
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <label
                  className="font-mono text-[10px] tracking-[0.2em] uppercase"
                  style={{ color: 'var(--muted)' }}
                >
                  Detailed Description
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Please provide steps to reproduce, error codes, and any troubleshooting you've already attempted..."
                  className="w-full p-4 rounded-xl outline-none resize-none transition-all font-body text-sm"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = 'rgba(198,241,53,0.4)')
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = 'var(--border)')
                  }
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>

              {/* File Upload */}
              <div className="space-y-3">
                <label
                  className="font-mono text-[10px] tracking-[0.2em] uppercase"
                  style={{ color: 'var(--muted)' }}
                >
                  Visual Evidence{' '}
                  <span style={{ color: 'var(--muted)', opacity: 0.5 }}>
                    (Optional)
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    id="file-upload"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <label
                    htmlFor="file-upload"
                    className="w-full rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all"
                    style={{
                      background: file
                        ? 'rgba(198,241,53,0.04)'
                        : 'var(--surface)',
                      border: `2px dashed ${file ? 'rgba(198,241,53,0.3)' : 'var(--border)'}`,
                    }}
                    onMouseEnter={(e) => {
                      if (!file)
                        (e.currentTarget as HTMLElement).style.borderColor =
                          'rgba(198,241,53,0.25)';
                    }}
                    onMouseLeave={(e) => {
                      if (!file)
                        (e.currentTarget as HTMLElement).style.borderColor =
                          'var(--border)';
                    }}
                  >
                    <div
                      className="p-3 rounded-xl transition-transform"
                      style={{
                        background: 'rgba(198,241,53,0.08)',
                        border: '1px solid rgba(198,241,53,0.15)',
                      }}
                    >
                      <UploadCloud
                        className="w-5 h-5"
                        style={{ color: 'var(--accent)' }}
                      />
                    </div>
                    <div className="text-center">
                      <span
                        className="block font-mono text-xs tracking-wider"
                        style={{
                          color: file ? 'var(--accent)' : 'var(--text)',
                        }}
                      >
                        {file ? file.name : 'Click to select or drag image'}
                      </span>
                      <span
                        className="font-mono text-[10px] mt-1 block"
                        style={{ color: 'var(--muted)' }}
                      >
                        PNG, JPG or GIF up to 10MB
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full font-mono text-sm tracking-widest uppercase flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: 'var(--accent)',
                    color: '#0a0a0f',
                    boxShadow: isSubmitting
                      ? 'none'
                      : '0 0 30px rgba(198,241,53,0.2)',
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {isUploadingImage
                        ? 'Uploading Evidence...'
                        : 'Creating Ticket...'}
                    </>
                  ) : (
                    <>
                      Submit Request
                      <MousePointer2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="sticky top-28 space-y-4">
              {/* Tips Card */}
              <div
                className="rounded-2xl p-8"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                }}
              >
                <h3
                  className="font-display text-xl tracking-wider mb-6 flex items-center gap-3"
                  style={{ color: 'var(--text)' }}
                >
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      background: 'rgba(198,241,53,0.1)',
                      border: '1px solid rgba(198,241,53,0.2)',
                    }}
                  >
                    <Info
                      className="w-4 h-4"
                      style={{ color: 'var(--accent)' }}
                    />
                  </div>
                  SUBMISSION TIPS
                </h3>
                <ul className="space-y-4">
                  {[
                    'Include specific error codes if available',
                    'List any recent changes to your setup',
                    'Attach screenshots for UI-related issues',
                    'Expected vs. actual behavior',
                  ].map((tip, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-sm leading-relaxed font-body"
                      style={{ color: 'var(--muted)' }}
                    >
                      <CheckCircle2
                        className="w-4 h-4 shrink-0 mt-0.5"
                        style={{ color: 'var(--accent)' }}
                      />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* SLA Card */}
              <div
                className="rounded-2xl p-8"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                }}
              >
                <h3
                  className="font-mono text-[10px] tracking-[0.25em] uppercase mb-6"
                  style={{ color: 'var(--muted)' }}
                >
                  ◈ Our SLA Commitment
                </h3>
                <div className="space-y-5">
                  {[
                    {
                      label: 'High Priority',
                      desc: 'Response within 2 hours',
                      color: '#f87171',
                    },
                    {
                      label: 'Medium Priority',
                      desc: 'Response within 8 hours',
                      color: '#fbbf24',
                    },
                    {
                      label: 'Low Priority',
                      desc: 'Response within 24 hours',
                      color: '#94a3b8',
                    },
                  ].map((item) => (
                    <div key={item.label} className="flex gap-4 items-start">
                      <div
                        className="w-0.5 rounded-full mt-1 self-stretch min-h-8"
                        style={{ background: item.color }}
                      />
                      <div>
                        <div
                          className="font-mono text-xs tracking-wider"
                          style={{ color: 'var(--text)' }}
                        >
                          {item.label}
                        </div>
                        <div
                          className="font-body text-xs mt-0.5"
                          style={{ color: 'var(--muted)' }}
                        >
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
