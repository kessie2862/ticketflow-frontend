'use client';

import { useState } from 'react';
import axios, { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { signupSchema, SignupFormData } from '@/lib/validations';
import {
  TicketCheck,
  User,
  Mail,
  Lock,
  Phone,
  Shield,
  Briefcase,
  Crown,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  Smartphone,
} from 'lucide-react';

type FormErrors = { [K in keyof SignupFormData]?: string };

/* ─── OTP Step ─────────────────────────────────────────────────────────────── */
function OtpInput({
  value,
  onChange,
  onVerify,
  loading,
}: {
  value: string;
  onChange: (val: string) => void;
  onVerify: () => void;
  loading: boolean;
}) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="text-center space-y-3">
        <div
          className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{
            background: 'rgba(198,241,53,0.1)',
            border: '1px solid rgba(198,241,53,0.2)',
          }}
        >
          <Smartphone className="w-7 h-7" style={{ color: 'var(--accent)' }} />
        </div>
        <h2
          className="font-display text-4xl tracking-wider"
          style={{ color: 'var(--text)' }}
        >
          Verify Phone
        </h2>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          We sent a 6-digit code to your number.
        </p>
      </div>

      <input
        type="text"
        maxLength={6}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ''))}
        className="w-full text-center text-3xl tracking-[1em] font-mono py-6 rounded-xl outline-none transition-all duration-200"
        style={{
          background: 'var(--surface-2)',
          border: '1px solid var(--border)',
          color: 'var(--accent)',
        }}
        placeholder="000000"
        onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
        onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
      />

      <button
        onClick={onVerify}
        disabled={loading || value.length !== 6}
        className="w-full py-4 rounded-xl font-display text-xl tracking-widest flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed glow-btn"
        style={{ background: 'var(--accent)', color: 'var(--surface)' }}
        onMouseEnter={(e) => {
          if (!loading && value.length === 6)
            (e.currentTarget as HTMLElement).style.background =
              'var(--accent-dim)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = 'var(--accent)';
        }}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          'Verify Account'
        )}
      </button>
    </div>
  );
}

/* ─── Reusable field input ─────────────────────────────────────────────────── */
function Field({
  icon: Icon,
  error,
  children,
}: {
  icon: React.ElementType;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="relative">
        <Icon
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
          style={{ color: 'var(--muted)' }}
        />
        {children}
      </div>
      {error && <p className="text-xs font-mono text-red-400 ml-1">{error}</p>}
    </div>
  );
}

const inputClass =
  'w-full pl-11 pr-4 py-3.5 rounded-xl text-sm font-medium outline-none transition-all duration-200';

const inputStyle = (hasError?: string) => ({
  background: 'var(--surface-2)',
  border: hasError ? '1px solid #ef4444' : '1px solid var(--border)',
  color: 'var(--text)',
});

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<'REGISTER' | 'VERIFY'>('REGISTER');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<SignupFormData>({
    username: '',
    email: '',
    phone_number: '',
    password: '',
    role: 'EMPLOYEE',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const result = signupSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register/`,
        form,
      );
      toast.success('Code sent to your phone!');
      setStep('VERIFY');
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.data) {
        const backendErrors = error.response.data;
        if (backendErrors.username)
          setErrors((prev) => ({ ...prev, username: 'Username taken' }));
        else if (backendErrors.phone_number)
          setErrors((prev) => ({
            ...prev,
            phone_number: 'Phone number already used',
          }));
        else toast.error('Registration failed.');
      } else {
        toast.error('Something went wrong.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp/`, {
        phone_number: form.phone_number,
        otp_code: otpCode,
      });
      toast.success('Account verified! Login now.');
      router.push('/login');
    } catch {
      toast.error('Invalid Code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof SignupFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const focusAccent = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.currentTarget.style.borderColor = 'var(--accent)');
  const blurBorder =
    (field: keyof SignupFormData) =>
    (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.style.borderColor = errors[field]
        ? '#ef4444'
        : 'var(--border)';
    };

  const roles = [
    {
      id: 'EMPLOYEE',
      label: 'Employee',
      icon: Briefcase,
      desc: 'Submit and track tickets',
    },
    {
      id: 'SUPPORT',
      label: 'Support',
      icon: Shield,
      desc: 'Resolve technical issues',
    },
    {
      id: 'ADMIN',
      label: 'Admin',
      icon: Crown,
      desc: 'Full system management',
    },
  ];

  return (
    <div
      className="min-h-screen grid lg:grid-cols-2 font-body"
      style={{ background: 'var(--surface)' }}
    >
      {/* Left Column */}
      <div
        className="hidden lg:flex p-12 flex-col justify-between relative overflow-hidden noise-bg"
        style={{
          background: 'var(--surface-2)',
          borderRight: '1px solid var(--border)',
        }}
      >
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'rgba(198,241,53,0.05)', filter: 'blur(80px)' }}
        />

        <Link href="/" className="flex items-center gap-3 relative z-10">
          <div
            className="p-2 rounded-xl"
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

        <div className="relative z-10 space-y-8">
          <div>
            <p
              className="font-display text-6xl leading-none"
              style={{ color: 'var(--accent)' }}
            >
              Start
            </p>
            <p
              className="font-display text-6xl leading-none"
              style={{ color: 'var(--text)' }}
            >
              Resolving.
            </p>
          </div>

          <ul className="space-y-4">
            {[
              'Lightning fast setup',
              'Customizable workflows',
              'Built-in Cloudinary uploads',
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-3 text-sm"
                style={{ color: 'var(--muted)' }}
              >
                <CheckCircle2
                  className="w-4 h-4 shrink-0"
                  style={{ color: 'var(--accent)' }}
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="relative z-10 text-xs font-mono uppercase tracking-widest"
          style={{ color: 'var(--muted)' }}
        >
          © 2026 TicketFlow.
        </div>
      </div>

      {/* Right Column */}
      <div
        className="flex items-center justify-center p-8 lg:p-16 relative overflow-y-auto"
        style={{ background: 'var(--surface)' }}
      >
        <div className="w-full max-w-md py-8">
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

          {step === 'REGISTER' ? (
            <>
              <div className="mb-8">
                <h1
                  className="font-display text-5xl tracking-wider mb-2"
                  style={{ color: 'var(--text)' }}
                >
                  Create Account
                </h1>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>
                  Join the next generation of support workflows.
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-5">
                {/* Label helper */}
                {(
                  [
                    [
                      'Username',
                      'username',
                      'text',
                      User,
                      'Enter your username',
                    ],
                    [
                      'Email Address',
                      'email',
                      'email',
                      Mail,
                      'username@company.com',
                    ],
                    [
                      'Phone Number',
                      'phone_number',
                      'tel',
                      Phone,
                      '233XXXXXXXXX',
                    ],
                  ] as [
                    string,
                    keyof SignupFormData,
                    string,
                    React.ElementType,
                    string,
                  ][]
                ).map(([label, field, type, Icon, placeholder]) => (
                  <div key={field} className="space-y-1.5">
                    <label
                      className="text-xs font-mono uppercase tracking-widest"
                      style={{ color: 'var(--muted)' }}
                    >
                      {label}
                    </label>
                    <Field icon={Icon} error={errors[field]}>
                      <input
                        type={type}
                        className={inputClass}
                        style={inputStyle(errors[field])}
                        placeholder={placeholder}
                        value={form[field] as string}
                        onChange={(e) => handleChange(field, e.target.value)}
                        onFocus={focusAccent}
                        onBlur={blurBorder(field)}
                      />
                    </Field>
                  </div>
                ))}

                {/* Password */}
                <div className="space-y-1.5">
                  <label
                    className="text-xs font-mono uppercase tracking-widest"
                    style={{ color: 'var(--muted)' }}
                  >
                    Secure Password
                  </label>
                  <div className="space-y-1.5">
                    <div className="relative">
                      <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                        style={{ color: 'var(--muted)' }}
                      />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className={`${inputClass} pr-12`}
                        style={inputStyle(errors.password)}
                        placeholder="**********"
                        value={form.password}
                        onChange={(e) =>
                          handleChange('password', e.target.value)
                        }
                        onFocus={focusAccent}
                        onBlur={blurBorder('password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 transition-colors duration-200"
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
                      <p className="text-xs font-mono text-red-400 ml-1">
                        {errors.password}
                      </p>
                    )}
                  </div>
                </div>

                {/* Role Selection */}
                <div className="space-y-3">
                  <label
                    className="text-xs font-mono uppercase tracking-widest"
                    style={{ color: 'var(--muted)' }}
                  >
                    Select Your Role
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {roles.map((r) => {
                      const selected = form.role === r.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => handleChange('role', r.id)}
                          className="flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200"
                          style={{
                            background: selected
                              ? 'rgba(198,241,53,0.08)'
                              : 'var(--surface-2)',
                            border: selected
                              ? '1px solid rgba(198,241,53,0.35)'
                              : '1px solid var(--border)',
                          }}
                        >
                          <div
                            className="p-2 rounded-lg shrink-0 transition-colors duration-200"
                            style={{
                              background: selected
                                ? 'var(--accent)'
                                : 'rgba(255,255,255,0.05)',
                            }}
                          >
                            <r.icon
                              className="w-4 h-4"
                              style={{
                                color: selected
                                  ? 'var(--surface)'
                                  : 'var(--muted)',
                              }}
                            />
                          </div>
                          <div>
                            <div
                              className="text-sm font-medium"
                              style={{
                                color: selected
                                  ? 'var(--accent)'
                                  : 'var(--text)',
                              }}
                            >
                              {r.label}
                            </div>
                            <div
                              className="text-xs"
                              style={{ color: 'var(--muted)' }}
                            >
                              {r.desc}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-display text-xl tracking-widest flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed glow-btn"
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
                      Create Account <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm" style={{ color: 'var(--muted)' }}>
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="font-mono font-medium transition-colors duration-200"
                    style={{ color: 'var(--accent)' }}
                  >
                    Sign in →
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <OtpInput
              value={otpCode}
              onChange={setOtpCode}
              onVerify={handleVerify}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
