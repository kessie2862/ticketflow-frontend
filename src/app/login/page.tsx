'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { loginSchema, LoginFormData } from '@/lib/validations';
import {
  TicketCheck,
  User,
  Lock,
  Loader2,
  ArrowRight,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<LoginFormData>({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<LoginFormData> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as keyof LoginFormData] = issue.message;
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    const signInResult = await signIn('credentials', {
      username: form.username,
      password: form.password,
      redirect: false,
    });

    if (signInResult?.error) {
      toast.error('Invalid username or password (or account not verified)');
      setLoading(false);
    } else {
      toast.success('Welcome back!');
      router.push('/dashboard');
    }
  };

  return (
    <div
      className="min-h-screen grid lg:grid-cols-2 font-body"
      style={{ background: 'var(--surface)' }}
    >
      {/* Left Column: Dark editorial panel */}
      <div
        className="hidden lg:flex p-12 flex-col justify-between relative overflow-hidden noise-bg"
        style={{
          background: 'var(--surface-2)',
          borderRight: '1px solid var(--border)',
        }}
      >
        {/* Accent blob */}
        <div
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'rgba(198,241,53,0.06)', filter: 'blur(60px)' }}
        />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 relative z-10 group">
          <div
            className="p-2 rounded-xl transition-colors duration-200"
            style={{ background: 'var(--accent)' }}
          >
            <TicketCheck
              className="w-5 h-5"
              style={{ color: 'var(--surface)' }}
            />
          </div>
          <span
            className="font-display text-3xl tracking-widest"
            style={{ color: 'var(--text)' }}
          >
            TicketFlow
          </span>
        </Link>

        {/* Body copy */}
        <div className="relative z-10 space-y-6">
          <p
            className="font-display text-6xl leading-none"
            style={{ color: 'var(--accent)' }}
          >
            Welcome
            <br />
            <span style={{ color: 'var(--text)' }}>Back.</span>
          </p>
          <p
            className="text-base leading-relaxed max-w-xs"
            style={{ color: 'var(--muted)' }}
          >
            Log in to continue managing your tickets, tracking progress, and
            staying on top of your workflow.
          </p>
        </div>

        <div
          className="relative z-10 text-xs font-mono uppercase tracking-widest"
          style={{ color: 'var(--muted)' }}
        >
          Secure access · Your dashboard awaits
        </div>
      </div>

      {/* Right Column: Form */}
      <div
        className="flex items-center justify-center p-8 lg:p-24 relative"
        style={{ background: 'var(--surface)' }}
      >
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <Link
            href="/"
            className="flex lg:hidden items-center gap-2 mb-10 justify-center"
          >
            <div
              className="p-1.5 rounded-lg"
              style={{ background: 'var(--accent)' }}
            >
              <TicketCheck
                className="w-4 h-4"
                style={{ color: 'var(--surface)' }}
              />
            </div>
            <span
              className="font-display text-2xl tracking-widest"
              style={{ color: 'var(--text)' }}
            >
              TicketFlow
            </span>
          </Link>

          <div className="mb-10">
            <h1
              className="font-display text-5xl tracking-wider mb-2"
              style={{ color: 'var(--text)' }}
            >
              Sign In
            </h1>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              Enter your credentials to access your desk.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-2">
              <label
                className="text-xs font-mono uppercase tracking-widest"
                style={{ color: 'var(--muted)' }}
              >
                Username
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: 'var(--muted)' }}
                />
                <input
                  type="text"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm font-medium outline-none transition-all duration-200"
                  style={{
                    background: 'var(--surface-2)',
                    border: errors.username
                      ? '1px solid #ef4444'
                      : '1px solid var(--border)',
                    color: 'var(--text)',
                  }}
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                  onFocus={(e) => {
                    if (!errors.username)
                      e.currentTarget.style.borderColor = 'var(--accent)';
                  }}
                  onBlur={(e) => {
                    if (!errors.username)
                      e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                />
              </div>
              {errors.username && (
                <p className="text-xs font-mono text-red-400">
                  {errors.username}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label
                  className="text-xs font-mono uppercase tracking-widest"
                  style={{ color: 'var(--muted)' }}
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-mono transition-colors duration-200"
                  style={{ color: 'var(--accent-dim)' }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = 'var(--accent)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = 'var(--accent-dim)')
                  }
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: 'var(--muted)' }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl text-sm font-medium outline-none transition-all duration-200"
                  style={{
                    background: 'var(--surface-2)',
                    border: errors.password
                      ? '1px solid #ef4444'
                      : '1px solid var(--border)',
                    color: 'var(--text)',
                  }}
                  placeholder="**********"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  onFocus={(e) => {
                    if (!errors.password)
                      e.currentTarget.style.borderColor = 'var(--accent)';
                  }}
                  onBlur={(e) => {
                    if (!errors.password)
                      e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-200 p-1"
                  style={{ color: 'var(--muted)' }}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs font-mono text-red-400">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-display text-xl tracking-widest flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-2 glow-btn"
              style={{
                background: 'var(--accent)',
                color: 'var(--surface)',
              }}
              onMouseEnter={(e) => {
                if (!loading)
                  (e.currentTarget as HTMLElement).style.background =
                    'var(--accent-dim)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  'var(--accent)';
              }}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="font-mono font-medium transition-colors duration-200"
                style={{ color: 'var(--accent)' }}
              >
                Create one →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
