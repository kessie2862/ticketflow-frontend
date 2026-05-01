'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  TicketCheck,
  ShieldCheck,
  Zap,
  ArrowRight,
  Layers,
  Clock,
  Users,
  BarChart3,
  Menu,
  X,
} from 'lucide-react';

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav
        className="fixed top-0 w-full z-50 font-body"
        style={{
          background: 'rgba(10,10,15,0.90)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--accent)' }}
            >
              <TicketCheck className="w-4 h-4 text-black" />
            </div>
            <span
              className="font-display text-2xl"
              style={{ color: 'var(--text)', letterSpacing: '0.15em' }}
            >
              TICKETFLOW
            </span>
          </Link>

          {/* Desktop right CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="nav-link">
              Sign In
            </Link>
            <Link
              href="/signup"
              className="glow-btn font-mono text-xs font-medium tracking-widest uppercase px-5 py-2.5 rounded-full flex items-center gap-2"
              style={{ background: 'var(--accent)', color: '#0a0a0f' }}
            >
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg transition-colors"
            style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile full-screen drawer */}
      {open && (
        <div
          className="mobile-drawer fixed inset-0 z-40 flex flex-col md:hidden"
          style={{
            background: 'rgba(10,10,15,0.97)',
            backdropFilter: 'blur(24px)',
            paddingTop: '4rem',
          }}
        >
          {/* Divider */}
          <div style={{ height: '1px', background: 'var(--border)' }} />

          {/* Auth CTAs */}
          <div className="flex flex-col gap-4">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="h-14 rounded-full font-mono text-sm tracking-widest uppercase flex items-center justify-center btn-outline"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              onClick={() => setOpen(false)}
              className="glow-btn h-14 rounded-full font-mono text-sm tracking-widest uppercase flex items-center justify-center gap-2"
              style={{ background: 'var(--accent)', color: '#0a0a0f' }}
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export function Hero() {
  return (
    <section className="relative noise-bg pt-36 sm:pt-40 pb-20 sm:pb-24 px-5 sm:px-6 flex flex-col items-center text-center overflow-hidden">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-100 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center top, rgba(198,241,53,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-5xl mx-auto w-full">
        <p
          className="animate-fade-up font-mono text-xs tracking-[0.25em] uppercase mb-5"
          style={{ color: 'var(--accent)' }}
        >
          ◈ Internal tooling, reimagined
        </p>

        <h1
          className="animate-fade-up delay-100 font-display leading-none mb-7"
          style={{
            color: 'var(--text)',
            fontSize: 'clamp(3.5rem,12vw,11rem)',
            lineHeight: '0.92',
          }}
        >
          SUPPORT
          <br />
          <span style={{ color: 'var(--accent)' }}>DESK</span> FOR
          <br />
          FAST TEAMS
        </h1>

        <p
          className="animate-fade-up delay-200 max-w-xl mx-auto text-base leading-relaxed mb-10"
          style={{ color: 'var(--muted)' }}
        >
          Manage internal tickets, track SLAs, and resolve blockers with a UI
          your team will actually enjoy.
        </p>

        <div className="animate-fade-up delay-300 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/login"
            className="glow-btn group w-full sm:w-auto h-14 px-10 rounded-full font-mono text-sm font-medium tracking-widest uppercase flex items-center justify-center gap-3"
            style={{ background: 'var(--accent)', color: '#0a0a0f' }}
          >
            Start Resolving Issues
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

const TICKER_ITEMS = [
  'VISUAL PIPELINES',
  '✦',
  'SMART SLA ALERTS',
  '✦',
  'TEAM COLLABORATION',
  '✦',
  'REAL-TIME ANALYTICS',
  '✦',
  'ROLE-BASED ACCESS',
  '✦',
  'CLOUDINARY UPLOADS',
  '✦',
];

export function Ticker() {
  return (
    <div
      className="ticker-wrap py-3 sm:py-4"
      style={{
        background: 'var(--accent)',
        borderTop: '1px solid rgba(0,0,0,0.1)',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
      }}
    >
      <div className="ticker-inner">
        {[0, 1].map((i) => (
          <span
            key={i}
            className="font-display text-xl sm:text-2xl tracking-widest text-black"
          >
            {TICKER_ITEMS.map((t, idx) => (
              <span key={`${i}-${idx}`} className="mx-5 sm:mx-6">
                {t}
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

const COLUMNS = [
  {
    label: 'Open',
    color: '#c6f135',
    items: [
      { title: 'API rate limit bug', tag: 'P1', age: '2m ago' },
      { title: 'Auth token expiry', tag: 'P2', age: '14m ago' },
    ],
  },
  {
    label: 'In Progress',
    color: '#60a5fa',
    items: [
      { title: 'DB migration script', tag: 'P1', age: '1h ago' },
      { title: 'CDN config mismatch', tag: 'P3', age: '3h ago' },
    ],
  },
  {
    label: 'Resolved',
    color: '#34d399',
    items: [{ title: 'Cache invalidation', tag: 'P2', age: 'Yesterday' }],
  },
];

function tagStyle(tag: string) {
  if (tag === 'P1')
    return { background: 'rgba(239,68,68,0.15)', color: '#f87171' };
  if (tag === 'P2')
    return { background: 'rgba(251,191,36,0.15)', color: '#fbbf24' };
  return { background: 'rgba(148,163,184,0.1)', color: 'var(--muted)' };
}

export function AppPreview() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div
          className="rounded-2xl sm:rounded-3xl overflow-hidden"
          style={{
            border: '1px solid var(--border)',
            background: 'var(--surface)',
          }}
        >
          {/* Browser bar */}
          <div
            className="h-10 sm:h-11 flex items-center px-4 sm:px-5 gap-3"
            style={{
              borderBottom: '1px solid var(--border)',
              background: 'var(--surface-2)',
            }}
          >
            <div className="flex gap-1.5 shrink-0">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
                  style={{ background: '#3a3a42' }}
                />
              ))}
            </div>
            <div
              className="flex-1 mx-2 sm:mx-6 h-5 sm:h-6 rounded-full flex items-center px-3 sm:px-4 overflow-hidden"
              style={{
                background: '#0a0a0f',
                border: '1px solid var(--border)',
              }}
            >
              <span
                className="font-mono text-xs truncate"
                style={{ color: 'var(--muted)' }}
              >
                https://ticketflow-fawn.vercel.app/dashboard
              </span>
            </div>
          </div>

          <div className="p-4 sm:p-6" style={{ background: '#0c0c12' }}>
            {/* Mobile view — stacked columns */}
            <div className="flex flex-col gap-6 sm:hidden">
              {COLUMNS.map((col) => (
                <div key={col.label}>
                  {/* Column header */}
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: col.color }}
                    />
                    <span
                      className="font-mono text-xs uppercase tracking-widest"
                      style={{ color: 'var(--muted)' }}
                    >
                      {col.label}
                    </span>
                    <span
                      className="font-mono text-xs ml-auto px-2 py-0.5 rounded-full"
                      style={{
                        background: 'var(--surface-2)',
                        color: 'var(--muted)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      {col.items.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {col.items.map((item) => (
                      <div
                        key={item.title}
                        className="p-3 rounded-xl"
                        style={{
                          background: 'var(--surface-2)',
                          border: '1px solid var(--border)',
                        }}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span
                            className="font-body text-sm font-medium"
                            style={{ color: 'var(--text)' }}
                          >
                            {item.title}
                          </span>
                          <span
                            className="font-mono text-xs px-2 py-0.5 rounded shrink-0"
                            style={tagStyle(item.tag)}
                          >
                            {item.tag}
                          </span>
                        </div>
                        <span
                          className="font-mono text-xs"
                          style={{ color: 'var(--muted)' }}
                        >
                          {item.age}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* sm+ view — scrollable / grid columns */}
            <div
              className="hidden sm:grid lg:grid-cols-3 gap-4"
              style={{ gridTemplateColumns: 'repeat(3, minmax(200px, 1fr))' }}
            >
              {COLUMNS.map((col) => (
                <div key={col.label} className="space-y-3">
                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: col.color }}
                    />
                    <span
                      className="font-mono text-xs uppercase tracking-widest"
                      style={{ color: 'var(--muted)' }}
                    >
                      {col.label}
                    </span>
                    <span
                      className="font-mono text-xs ml-auto px-2 py-0.5 rounded-full"
                      style={{
                        background: 'var(--surface-2)',
                        color: 'var(--muted)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      {col.items.length}
                    </span>
                  </div>
                  {col.items.map((item) => (
                    <div
                      key={item.title}
                      className="p-4 rounded-xl"
                      style={{
                        background: 'var(--surface-2)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span
                          className="font-body text-sm font-medium"
                          style={{ color: 'var(--text)' }}
                        >
                          {item.title}
                        </span>
                        <span
                          className="font-mono text-xs px-2 py-0.5 rounded shrink-0"
                          style={tagStyle(item.tag)}
                        >
                          {item.tag}
                        </span>
                      </div>
                      <span
                        className="font-mono text-xs"
                        style={{ color: 'var(--muted)' }}
                      >
                        {item.age}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
}) {
  return (
    <div
      className="card-hover group p-8 sm:p-10 flex flex-col gap-5"
      style={{ background: '#0a0a0f' }}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
        style={{
          background: `${color}15`,
          border: `1px solid ${color}30`,
          color,
        }}
      >
        {icon}
      </div>
      <div>
        <h3
          className="font-display text-2xl mb-2"
          style={{ color: '#f0f0f5', letterSpacing: '0.06em' }}
        >
          {title.toUpperCase()}
        </h3>
        <p
          className="text-sm leading-relaxed font-body"
          style={{ color: '#72727a' }}
        >
          {desc}
        </p>
      </div>
    </div>
  );
}

const FEATURES = [
  {
    icon: <Layers className="w-5 h-5" />,
    title: 'Visual Pipelines',
    desc: 'Flexible Kanban boards with drag-and-drop. Move tickets through stages and close issues in seconds.',
    color: '#818cf8',
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: 'Smart SLA Alerts',
    desc: 'Auto-escalation for high-priority items approaching breach. Never let a critical bug sit unattended.',
    color: '#fbbf24',
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: 'Secure by Default',
    desc: 'Enterprise-grade role management baked in. Data only reaches the eyes it was meant for.',
    color: '#34d399',
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: 'Team Collaboration',
    desc: 'Threads, attachments, @mentions — keep the conversation exactly where the problem lives.',
    color: '#60a5fa',
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: 'Powerful Analytics',
    desc: 'Resolution times, agent performance, system health. Real-time dashboards your managers will love.',
    color: '#f87171',
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Cloudinary Powered',
    desc: 'Instantly upload and optimize diagnostic screenshots. No more broken image links in tickets.',
    color: '#c6f135',
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-4 sm:gap-6">
          <div>
            <p
              className="font-mono text-xs tracking-[0.2em] uppercase mb-4"
              style={{ color: 'var(--accent)' }}
            >
              ◈ What&apos;s inside
            </p>
            <h2
              className="font-display leading-none"
              style={{
                color: 'var(--text)',
                fontSize: 'clamp(2.5rem,8vw,6rem)',
              }}
            >
              EVERY TOOL
              <br />
              YOU NEED.
            </h2>
          </div>
          <p
            className="max-w-xs text-sm leading-relaxed"
            style={{ color: 'var(--muted)' }}
          >
            Designed from the ground up for teams who move fast and hate context
            switching.
          </p>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px"
          style={{
            background: 'var(--border)',
            borderRadius: '24px',
            overflow: 'hidden',
          }}
        >
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaSection() {
  return (
    <section className="py-20 sm:py-32 px-4 sm:px-6">
      <div
        className="max-w-5xl mx-auto rounded-2xl sm:rounded-3xl relative overflow-hidden flex flex-col items-center text-center py-16 sm:py-20 px-6 sm:px-8"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(198,241,53,0.07) 0%, transparent 65%)',
          }}
        />
        <p
          className="relative font-mono text-xs tracking-[0.25em] uppercase mb-6"
          style={{ color: 'var(--accent)' }}
        >
          ◈ Ready when you are
        </p>
        <h2
          className="relative font-display leading-none mb-8"
          style={{ color: 'var(--text)', fontSize: 'clamp(2.5rem,8vw,7rem)' }}
        >
          SHIP FASTER.
          <br />
          BREAK LESS.
        </h2>
        <Link
          href="/signup"
          className="glow-btn relative group w-full sm:w-auto font-mono text-sm tracking-widest uppercase px-12 py-4 rounded-full flex items-center justify-center gap-3"
          style={{ background: 'var(--accent)', color: '#0a0a0f' }}
        >
          Get Started Free
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}

export function Footer({ year }: { year: number }) {
  return (
    <footer
      className="py-10 font-body"
      style={{ borderTop: '1px solid var(--border)' }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-5">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded flex items-center justify-center"
            style={{ background: 'var(--accent)' }}
          >
            <TicketCheck className="w-3.5 h-3.5 text-black" />
          </div>
          <span
            className="font-display text-xl"
            style={{
              color: 'var(--text)',
              opacity: 0.5,
              letterSpacing: '0.15em',
            }}
          >
            TICKETFLOW
          </span>
        </div>

        <p className="font-mono text-xs" style={{ color: 'var(--muted)' }}>
          © {year} Built with Next.js &amp; Django.
        </p>
      </div>
    </footer>
  );
}
