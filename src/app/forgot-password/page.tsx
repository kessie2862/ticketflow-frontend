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

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

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

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

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

  const inputBase =
    'w-full py-3.5 rounded-xl text-sm font-medium outline-none transition-all duration-200';

  const inputStyle = (errorKey?: string) => ({
    background: 'var(--surface-2)',
    border: errors[errorKey ?? '']
      ? '1px solid #ef4444'
      : '1px solid var(--border)',
    color: 'var(--text)',
  });

  const focusAccent = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.currentTarget.style.borderColor = 'var(--accent)');
  const blurBorder =
    (key: string) => (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.style.borderColor = errors[key]
        ? '#ef4444'
        : 'var(--border)';
    };

  return (
    <div
      className="min-h-screen grid lg:grid-cols-2 font-body"
      style={{ background: 'var(--surface)' }}
    >
      {/* Left Visual Panel */}
      <div
        className="hidden lg:flex p-12 flex-col justify-between relative overflow-hidden noise-bg"
        style={{
          background: 'var(--surface-2)',
          borderRight: '1px solid var(--border)',
        }}
      >
        <div
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'rgba(198,241,53,0.06)', filter: 'blur(80px)' }}
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

        <div className="relative z-10 space-y-6">
          <KeyRound className="w-12 h-12" style={{ color: 'var(--accent)' }} />
          <div>
            <p
              className="font-display text-5xl leading-none mb-1"
              style={{ color: 'var(--accent)' }}
            >
              Account
            </p>
            <p
              className="font-display text-5xl leading-none"
              style={{ color: 'var(--text)' }}
            >
              Recovery.
            </p>
          </div>
          <p
            className="text-sm leading-relaxed max-w-xs"
            style={{ color: 'var(--muted)' }}
          >
            Don&apos;t worry, it happens to the best of us. We&apos;ll get you
            back in seconds.
          </p>
        </div>

        <div
          className="relative z-10 text-xs font-mono uppercase tracking-widest"
          style={{ color: 'var(--muted)' }}
        >
          © 2026 TicketFlow Infrastructure.
        </div>
      </div>

      {/* Right Form Panel */}
      <div
        className="flex items-center justify-center p-8 lg:p-24"
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

          {/* Card */}
          <div
            className="p-8 rounded-2xl"
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
            }}
          >
            <div className="mb-8">
              <Link
                href="/login"
                className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-widest mb-6 transition-colors duration-200"
                style={{ color: 'var(--muted)' }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = 'var(--accent)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = 'var(--muted)')
                }
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Back to Login
              </Link>

              <h1
                className="font-display text-4xl tracking-wider mb-2"
                style={{ color: 'var(--text)' }}
              >
                {step === 'PHONE' ? 'Forgot Password' : 'Reset Password'}
              </h1>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                {step === 'PHONE'
                  ? 'Enter your phone number to receive a recovery code.'
                  : 'Enter the code sent to your phone and your new password.'}
              </p>
            </div>

            {step === 'PHONE' ? (
              <form onSubmit={handleSendOtp} className="space-y-5">
                <div className="space-y-1.5">
                  <label
                    className="text-xs font-mono uppercase tracking-widest"
                    style={{ color: 'var(--muted)' }}
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                      style={{ color: 'var(--muted)' }}
                    />
                    <input
                      type="tel"
                      className={`${inputBase} pl-11 pr-4`}
                      style={inputStyle('phone')}
                      placeholder="233XXXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onFocus={focusAccent}
                      onBlur={blurBorder('phone')}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs font-mono text-red-400 ml-1">
                      {errors.phone}
                    </p>
                  )}
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
                      Send Code <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleReset} className="space-y-5">
                {/* OTP */}
                <div className="space-y-1.5">
                  <label
                    className="text-xs font-mono uppercase tracking-widest"
                    style={{ color: 'var(--muted)' }}
                  >
                    OTP Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    className={`${inputBase} text-center text-2xl tracking-[0.5em] px-4`}
                    style={{
                      ...inputStyle('otp_code'),
                      color: 'var(--accent)',
                    }}
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/[^0-9]/g, ''))
                    }
                    placeholder="000000"
                    onFocus={focusAccent}
                    onBlur={blurBorder('otp_code')}
                  />
                  {errors.otp_code && (
                    <p className="text-xs font-mono text-red-400 ml-1">
                      {errors.otp_code}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                  <label
                    className="text-xs font-mono uppercase tracking-widest"
                    style={{ color: 'var(--muted)' }}
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                      style={{ color: 'var(--muted)' }}
                    />
                    <input
                      type="password"
                      className={`${inputBase} pl-11 pr-4`}
                      style={inputStyle('new_password')}
                      placeholder="**********"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      onFocus={focusAccent}
                      onBlur={blurBorder('new_password')}
                    />
                  </div>
                  {errors.new_password && (
                    <p className="text-xs font-mono text-red-400 ml-1">
                      {errors.new_password}
                    </p>
                  )}
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
                    'Reset Password'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// // src/app/forgot-password/page.tsx

// 'use client';

// import { useState } from 'react';
// import axios, { isAxiosError } from 'axios';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { toast } from 'react-hot-toast';
// import { forgotPasswordSchema, resetPasswordSchema } from '@/lib/validations';
// import {
//   TicketCheck,
//   Phone,
//   Lock,
//   ArrowRight,
//   Loader2,
//   KeyRound,
//   ChevronLeft,
// } from 'lucide-react';

// export default function ForgotPasswordPage() {
//   const router = useRouter();
//   const [step, setStep] = useState<'PHONE' | 'RESET'>('PHONE');
//   const [loading, setLoading] = useState(false);

//   // Data State
//   const [phone, setPhone] = useState('');
//   const [otp, setOtp] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   // Send OTP
//   const handleSendOtp = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrors({});

//     // Validate Phone
//     const result = forgotPasswordSchema.safeParse({ phone_number: phone });
//     if (!result.success) {
//       setErrors({ phone: result.error.issues[0].message });
//       return;
//     }

//     setLoading(true);
//     try {
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password/`,
//         {
//           phone_number: phone,
//         },
//       );
//       toast.success('Verification code sent.');
//       setStep('RESET');
//     } catch (error: unknown) {
//       if (isAxiosError(error) && error.response?.status === 404) {
//         setErrors({ phone: 'User not found with this number.' });
//       } else {
//         toast.error('Failed to send OTP.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Reset Password
//   const handleReset = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrors({});

//     // Validate Inputs
//     const result = resetPasswordSchema.safeParse({
//       otp_code: otp,
//       new_password: newPassword,
//     });
//     if (!result.success) {
//       const fieldErrors: Record<string, string> = {};
//       result.error.issues.forEach((issue) => {
//         fieldErrors[issue.path[0] as string] = issue.message;
//       });
//       setErrors(fieldErrors);
//       return;
//     }

//     setLoading(true);
//     try {
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password/`,
//         {
//           phone_number: phone,
//           otp_code: otp,
//           new_password: newPassword,
//         },
//       );
//       toast.success('Password updated! Please login.');
//       router.push('/login');
//     } catch {
//       toast.error('Invalid OTP or error resetting password.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen grid lg:grid-cols-2 bg-white">
//       {/* Visual Side */}
//       <div className="hidden lg:flex bg-slate-900 p-12 flex-col justify-between relative overflow-hidden">
//         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.2),transparent)] pointer-events-none" />
//         <Link href="/" className="flex items-center gap-2 relative z-10">
//           <div className="bg-indigo-600 p-2 rounded-xl">
//             <TicketCheck className="w-6 h-6 text-white" />
//           </div>
//           <span className="text-2xl font-black text-white tracking-tight">
//             TicketFlow
//           </span>
//         </Link>
//         <div className="relative z-10">
//           <KeyRound className="w-16 h-16 text-indigo-500 mb-6" />
//           <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
//             Account Recovery
//           </h2>
//           <p className="text-slate-400 text-lg">
//             Don&apos;t worry, it happens to the best of us. We&apos;ll get you
//             back in your account in seconds.
//           </p>
//         </div>
//         <div className="relative z-10 text-slate-500 text-sm font-medium">
//           © 2026 TicketFlow Infrastructure.
//         </div>
//       </div>

//       {/* Form Side */}
//       <div className="flex items-center justify-center p-8 lg:p-24 bg-slate-50/50">
//         <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl shadow-slate-200 border border-slate-100">
//           <div className="mb-8">
//             <Link
//               href="/login"
//               className="flex items-center gap-1 text-sm font-bold text-slate-400 hover:text-slate-600 mb-6 transition-colors"
//             >
//               <ChevronLeft className="w-4 h-4" />
//               Back to Login
//             </Link>
//             <h1 className="text-2xl font-black text-slate-900 mb-2">
//               {step === 'PHONE' ? 'Forgot Password?' : 'Reset Password'}
//             </h1>
//             <p className="text-slate-500 font-medium text-sm">
//               {step === 'PHONE'
//                 ? 'Enter your phone number to receive a recovery code.'
//                 : 'Enter the code sent to your phone and your new password.'}
//             </p>
//           </div>

//           {step === 'PHONE' ? (
//             <form onSubmit={handleSendOtp} className="space-y-6">
//               <div className="space-y-2">
//                 <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
//                   Phone Number
//                 </label>
//                 <div className="relative mt-2">
//                   <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//                   <input
//                     type="tel"
//                     className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3.5 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
//                     placeholder="233XXXXXXXXX"
//                     value={phone}
//                     onChange={(e) => setPhone(e.target.value)}
//                   />
//                 </div>
//                 {errors.phone && (
//                   <p className="text-xs font-bold text-red-500 ml-1">
//                     {errors.phone}
//                   </p>
//                 )}
//               </div>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 disabled:opacity-70 transition-all flex items-center justify-center gap-2"
//               >
//                 {loading ? (
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                 ) : (
//                   <>
//                     Send Code <ArrowRight className="w-5 h-5" />
//                   </>
//                 )}
//               </button>
//             </form>
//           ) : (
//             <form onSubmit={handleReset} className="space-y-6">
//               <div className="space-y-2">
//                 <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
//                   OTP Code
//                 </label>
//                 <input
//                   type="text"
//                   maxLength={6}
//                   className="w-full text-center text-2xl tracking-[0.5em] font-bold py-3.5 border border-slate-200 rounded-2xl focus:border-indigo-600 outline-none transition-all"
//                   value={otp}
//                   onChange={(e) =>
//                     setOtp(e.target.value.replace(/[^0-9]/g, ''))
//                   }
//                   placeholder="000000"
//                 />
//                 {errors.otp_code && (
//                   <p className="text-xs font-bold text-red-500 ml-1">
//                     {errors.otp_code}
//                   </p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
//                   New Password
//                 </label>
//                 <div className="relative mt-2">
//                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//                   <input
//                     type="password"
//                     className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3.5 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
//                     placeholder="**********"
//                     value={newPassword}
//                     onChange={(e) => setNewPassword(e.target.value)}
//                   />
//                 </div>
//                 {errors.new_password && (
//                   <p className="text-xs font-bold text-red-500 ml-1">
//                     {errors.new_password}
//                   </p>
//                 )}
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 disabled:opacity-70 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
//               >
//                 {loading ? (
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                 ) : (
//                   'Reset Password'
//                 )}
//               </button>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
