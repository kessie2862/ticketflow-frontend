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

  // 1. Get the mutation hook from useTickets
  const { useCreateTicket } = useTickets();
  const { mutate: createTicket, isPending: isCreatingTicket } =
    useCreateTicket();

  // Combined loading state
  const isSubmitting = isUploadingImage || isCreatingTicket;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let attachmentUrl = null;

    // 2. Handle Image Upload first (if exists)
    if (file) {
      try {
        attachmentUrl = await uploadImage(file);
      } catch {
        // useCloudinaryUpload handles the error toast usually, but we stop submission here
        return;
      }
    }

    // 3. Create Ticket using the Mutation Hook
    // This triggers `invalidateTicketQueries()` in useTickets.ts automatically on success
    createTicket(
      {
        title,
        description: desc,
        priority,
        attachment_url: attachmentUrl,
      },
      {
        onSuccess: () => {
          // Toast is already handled by the hook, we just need to navigate
          router.push('/dashboard');
        },
      },
    );
  };

  const priorityOptions = [
    {
      id: 'LOW',
      label: 'Low',
      color: 'bg-slate-100 text-slate-600 border-slate-200',
    },
    {
      id: 'MEDIUM',
      label: 'Medium',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      id: 'HIGH',
      label: 'High',
      color: 'bg-rose-50 text-rose-700 border-rose-200',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="group flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </Link>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Drafting New Request
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            <header className="mb-10">
              <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
                Open a Support Ticket
              </h1>
              <p className="text-md md:text-lg text-slate-500">
                Provide the details of your issue and our team will get right on
                it.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Subject Input */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  Issue Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Access denied to production database"
                  className="w-full bg-white border border-slate-200 p-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-lg shadow-sm placeholder:text-sm md:placeholder:text-lg"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Priority Selector */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Urgency Level
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {priorityOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPriority(opt.id as Priority)}
                      className={`
                        p-4 rounded-2xl border-2 transition-all text-sm font-bold flex flex-col items-center gap-2
                        ${
                          priority === opt.id
                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 ring-4 ring-indigo-500/5'
                            : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                        }
                      `}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          opt.id === 'HIGH'
                            ? 'bg-rose-500'
                            : opt.id === 'MEDIUM'
                              ? 'bg-amber-500'
                              : 'bg-slate-400'
                        }`}
                      />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                  Detailed Description
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Please provide steps to reproduce, error codes, and any troubleshooting you've already attempted..."
                  className="w-full bg-white border border-slate-200 p-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none shadow-sm placeholder:text-sm md:placeholder:text-lg"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>

              {/* Custom File Upload Dropzone */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                  Visual Evidence (Optional)
                </label>
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    id="file-upload"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <label
                    htmlFor="file-upload"
                    className={`
                      w-full border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all
                      ${
                        file
                          ? 'border-indigo-400 bg-indigo-50/30'
                          : 'border-slate-200 bg-white hover:border-indigo-400 hover:bg-slate-50'
                      }
                    `}
                  >
                    <div className="p-3 bg-indigo-50 rounded-full text-indigo-600 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <span className="block font-bold text-slate-700">
                        {file ? file.name : 'Click to select or drag image'}
                      </span>
                      <span className="text-xs text-slate-400">
                        PNG, JPG or GIF up to 10MB
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-slate-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                      {isUploadingImage
                        ? 'Uploading Evidence...'
                        : 'Creating Ticket...'}
                    </>
                  ) : (
                    <>
                      Submit Request
                      <MousePointer2 className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Information/Help Sidebar */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="sticky top-28 space-y-6">
              <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-200">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-indigo-200" />
                  Submission Tips
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
                      className="flex gap-3 text-indigo-100 text-sm leading-relaxed"
                    >
                      <CheckCircle2 className="w-5 h-5 text-indigo-300 shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6">
                  Our SLA Commitment
                </h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-1 bg-rose-500 rounded-full" />
                    <div>
                      <div className="text-sm font-bold text-slate-800">
                        High Priority
                      </div>
                      <div className="text-xs text-slate-500">
                        Response within 2 hours
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-1 bg-amber-500 rounded-full" />
                    <div>
                      <div className="text-sm font-bold text-slate-800">
                        Medium Priority
                      </div>
                      <div className="text-xs text-slate-500">
                        Response within 8 hours
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-1 bg-slate-300 rounded-full" />
                    <div>
                      <div className="text-sm font-bold text-slate-800">
                        Low Priority
                      </div>
                      <div className="text-xs text-slate-500">
                        Response within 24 hours
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
