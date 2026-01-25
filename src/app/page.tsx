import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/auth';
import { redirect } from 'next/navigation';
import {
  TicketCheck,
  ShieldCheck,
  Zap,
  ArrowRight,
  Layers,
  Clock,
  Users,
  BarChart3,
} from 'lucide-react';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-indigo-100">
      {/* 1. Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <TicketCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">
              TicketFlow
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20">
        {/* 2. Hero Section */}
        <section className="px-6">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-8 animate-fade-in">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
              NEW: Drag & Drop Kanban v2.0
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.9]">
              Support desk for <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-violet-500">
                fast teams.
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-slate-500 mb-10 leading-relaxed">
              Ditch the clunky enterprise software. Manage internal tickets,
              track SLAs, and resolve engineering hurdles with a UI your team
              will actually enjoy using.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/login"
                className="group h-14 px-10 bg-indigo-600 text-white rounded-full font-bold text-lg hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 flex items-center gap-2"
              >
                Start Resolving Issues
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* 3. Dashboard Preview (Simulated UI) */}
        <section className="mt-20 px-6 overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="bg-slate-900 rounded-4xl p-4 shadow-2xl border-8 border-slate-100">
              <div className="bg-white rounded-3xl aspect-video overflow-hidden shadow-inner flex flex-col">
                <div className="h-12 border-b border-slate-100 flex items-center px-6 justify-between">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-100" />
                    <div className="w-3 h-3 rounded-full bg-amber-100" />
                    <div className="w-3 h-3 rounded-full bg-green-100" />
                  </div>
                  <div className="h-4 w-32 bg-slate-100 rounded-full" />
                </div>
                <div className="flex-1 p-6 grid grid-cols-3 gap-6 bg-slate-50">
                  <div className="space-y-4">
                    <div className="h-6 w-20 bg-indigo-100 rounded-full mb-4" />
                    <div className="h-24 bg-white rounded-2xl shadow-sm border border-slate-100" />
                    <div className="h-24 bg-white rounded-2xl shadow-sm border border-slate-100" />
                  </div>
                  <div className="space-y-4">
                    <div className="h-6 w-24 bg-slate-200 rounded-full mb-4" />
                    <div className="h-24 bg-white rounded-2xl shadow-sm border border-slate-100" />
                    <div className="h-32 bg-white rounded-2xl shadow-sm border border-indigo-200 ring-2 ring-indigo-50" />
                  </div>
                  <div className="space-y-4">
                    <div className="h-6 w-16 bg-emerald-100 rounded-full mb-4" />
                    <div className="h-24 bg-white rounded-2xl shadow-sm border border-slate-100" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Social Proof / Stats */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: 'Active Users', value: '12k+' },
                { label: 'Avg Resolution', value: '4.2h' },
                { label: 'Uptime', value: '99.9%' },
                { label: 'CSAT Score', value: '4.9/5' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl font-black text-slate-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Features Grid */}
        <section id="features" className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-black text-slate-900 mb-4">
                Everything you need to ship.
              </h2>
              <p className="text-slate-500 font-medium">
                Built for engineers, by engineers.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Layers className="text-indigo-600" />}
                title="Visual Pipelines"
                desc="Manage requests through a flexible Kanban system. Drag, drop, and resolve in seconds."
              />
              <FeatureCard
                icon={<Clock className="text-amber-500" />}
                title="Smart SLA Alerts"
                desc="Never let a critical bug sit. Automatic escalation for high-priority items approaching breach."
              />
              <FeatureCard
                icon={<ShieldCheck className="text-emerald-500" />}
                title="Secure by Default"
                desc="Enterprise-grade role management. Ensure data only reaches the eyes it was intended for."
              />
              <FeatureCard
                icon={<Users className="text-blue-500" />}
                title="Team Collaboration"
                desc="Threads, attachments, and mentions. Keep the conversation where the problem is."
              />
              <FeatureCard
                icon={<BarChart3 className="text-rose-500" />}
                title="Powerful Analytics"
                desc="Track resolution times, agent performance, and system health with real-time dashboards."
              />
              <FeatureCard
                icon={<Zap className="text-purple-600" />}
                title="Cloudinary Powered"
                desc="Instantly upload and optimize diagnostic screenshots with our native cloud integration."
              />
            </div>
          </div>
        </section>

        {/* 6. Call to Action */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto bg-slate-900 rounded-[40px] p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.15),transparent)] pointer-events-none" />
            <h2 className="text-4xl font-bold text-white mb-6 relative z-10">
              Ready to transform your support?
            </h2>
            <p className="text-slate-400 mb-10 text-lg relative z-10">
              Join 500+ teams resolving issues faster with TicketFlow.
            </p>
            <Link
              href="/login"
              className="inline-flex h-14 px-10 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-slate-100 transition-all relative z-10 items-center justify-center"
            >
              Get Started for Free
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <TicketCheck className="w-5 h-5" />
            <span className="font-bold">TicketFlow</span>
          </div>
          <div className="flex gap-8 text-sm font-bold text-slate-400">
            <Link href="#" className="hover:text-slate-900">
              Privacy
            </Link>
            <Link href="#" className="hover:text-slate-900">
              Terms
            </Link>
            <Link href="#" className="hover:text-slate-900">
              Security
            </Link>
          </div>
          <p className="text-sm text-slate-400 font-medium">
            © 2026 Built with Next.js & Django.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="p-10 bg-white rounded-4xl border border-slate-100 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300 group">
      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white transition-all duration-300 shadow-sm border border-slate-100">
        {icon}
      </div>
      <h3 className="text-xl font-black text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm font-medium">
        {desc}
      </p>
    </div>
  );
}
