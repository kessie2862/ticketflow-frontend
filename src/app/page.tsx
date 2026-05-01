import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/auth';
import { redirect } from 'next/navigation';
import {
  Navbar,
  Hero,
  Ticker,
  AppPreview,
  FeaturesSection,
  CtaSection,
  Footer,
} from '@/components/HomeClient';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (session) redirect('/dashboard');

  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0f] selection:bg-lime-400/20 selection:text-lime-300 overflow-x-hidden">
      <Navbar />

      <main className="font-body">
        <Hero />
        <Ticker />
        <AppPreview />
        <FeaturesSection />
        <CtaSection />
      </main>

      <Footer year={currentYear} />
    </div>
  );
}
