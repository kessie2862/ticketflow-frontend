'use client';

import { useState } from 'react';
import axios, { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { forgotPasswordSchema, resetPasswordSchema } from '@/lib/validations';
import {
  TicketCheck,
  Phone,
  Lock,
  ArrowRight,
  Loader2,
  KeyRound,
  ChevronLeft,
} from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<'PHONE' | 'RESET'>('PHONE');
  const [loading, setLoading] = useState(false);

  // Data State
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate Phone
    const result = forgotPasswordSchema.safeParse({ phone_number: phone });
    if (!result.success) {
      setErrors({ phone: result.error.issues[0].message });
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password/`,
        {
          phone_number: phone,
        },
      );
      toast.success('Verification code sent.');
      setStep('RESET');
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 404) {
        setErrors({ phone: 'User not found with this number.' });
      } else {
        toast.error('Failed to send OTP.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset Password
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate Inputs
    const result = resetPasswordSchema.safeParse({
      otp_code: otp,
      new_password: newPassword,
    });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password/`,
        {
          phone_number: phone,
          otp_code: otp,
          new_password: newPassword,
        },
      );
      toast.success('Password updated! Please login.');
      router.push('/login');
    } catch {
      toast.error('Invalid OTP or error resetting password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Visual Side */}
      <div className="hidden lg:flex bg-slate-900 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.2),transparent)] pointer-events-none" />
        <Link href="/" className="flex items-center gap-2 relative z-10">
          <div className="bg-indigo-600 p-2 rounded-xl">
            <TicketCheck className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">
            TicketFlow
          </span>
        </Link>
        <div className="relative z-10">
          <KeyRound className="w-16 h-16 text-indigo-500 mb-6" />
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Account Recovery
          </h2>
          <p className="text-slate-400 text-lg">
            Don&apos;t worry, it happens to the best of us. We&apos;ll get you
            back in your account in seconds.
          </p>
        </div>
        <div className="relative z-10 text-slate-500 text-sm font-medium">
          © 2026 TicketFlow Infrastructure.
        </div>
      </div>

      {/* Form Side */}
      <div className="flex items-center justify-center p-8 lg:p-24 bg-slate-50/50">
        <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl shadow-slate-200 border border-slate-100">
          <div className="mb-8">
            <Link
              href="/login"
              className="flex items-center gap-1 text-sm font-bold text-slate-400 hover:text-slate-600 mb-6 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Login
            </Link>
            <h1 className="text-2xl font-black text-slate-900 mb-2">
              {step === 'PHONE' ? 'Forgot Password?' : 'Reset Password'}
            </h1>
            <p className="text-slate-500 font-medium text-sm">
              {step === 'PHONE'
                ? 'Enter your phone number to receive a recovery code.'
                : 'Enter the code sent to your phone and your new password.'}
            </p>
          </div>

          {step === 'PHONE' ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                  Phone Number
                </label>
                <div className="relative mt-2">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3.5 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                    placeholder="233XXXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs font-bold text-red-500 ml-1">
                    {errors.phone}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 disabled:opacity-70 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Send Code <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleReset} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                  OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  className="w-full text-center text-2xl tracking-[0.5em] font-bold py-3.5 border border-slate-200 rounded-2xl focus:border-indigo-600 outline-none transition-all"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/[^0-9]/g, ''))
                  }
                  placeholder="000000"
                />
                {errors.otp_code && (
                  <p className="text-xs font-bold text-red-500 ml-1">
                    {errors.otp_code}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                  New Password
                </label>
                <div className="relative mt-2">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3.5 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                    placeholder="**********"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                {errors.new_password && (
                  <p className="text-xs font-bold text-red-500 ml-1">
                    {errors.new_password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 disabled:opacity-70 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
