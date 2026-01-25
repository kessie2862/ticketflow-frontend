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
  Quote,
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
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Left Column: Testimonial/Brand */}
      <div className="hidden lg:flex bg-indigo-600 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

        <Link href="/" className="flex items-center gap-2 relative z-10">
          <div className="bg-white p-2 rounded-xl">
            <TicketCheck className="w-6 h-6 text-indigo-600" />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">
            TicketFlow
          </span>
        </Link>

        <div className="relative z-10">
          <Quote className="w-12 h-12 text-indigo-400 mb-6 opacity-50" />
          <h2 className="text-3xl font-medium text-white italic mb-8 leading-relaxed">
            &apos;This platform has cut our support resolution time by 40%. The
            UI is so intuitive that our engineers actually enjoy closing
            tickets.&apos;
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-500 border-2 border-indigo-400" />
            <div>
              <div className="text-white font-bold">Sarah Jenkins</div>
              <div className="text-indigo-200 text-sm font-medium">
                Head of Ops at TicketFlow
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-indigo-300 text-sm font-medium">
          Trusted by over 500+ engineering teams worldwide.
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="flex items-center justify-center p-8 lg:p-24 bg-slate-50/50">
        <div className="w-full max-w-sm">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-black text-slate-900 mb-2">
              Welcome back
            </h1>
            <p className="text-slate-500 font-medium">
              Enter your credentials to access your desk.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                  Username
                </label>
                <div className="relative mt-2">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    className={`w-full bg-white border ${errors.username ? 'border-red-500 ring-4 ring-red-500/5' : 'border-slate-200'} pl-11 pr-4 py-3.5 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm font-medium`}
                    placeholder="your_username"
                    value={form.username}
                    onChange={(e) =>
                      setForm({ ...form, username: e.target.value })
                    }
                  />
                </div>
                {errors.username && (
                  <p className="text-xs font-bold text-red-500 ml-1">
                    {errors.username}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Password
                  </label>
                  {/* UPDATE: Linked to the new Forgot Password page */}
                  <Link
                    href="/forgot-password"
                    className="text-xs font-bold text-indigo-600 hover:underline"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`w-full bg-white border ${errors.password ? 'border-red-500 ring-4 ring-red-500/5' : 'border-slate-200'} pl-11 pr-12 py-3.5 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm font-medium`}
                    placeholder="**********"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
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
                  <p className="text-xs font-bold text-red-500 ml-1">
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 active:scale-[0.98]"
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
            <p className="text-slate-500 font-medium">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="text-indigo-600 font-bold hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
