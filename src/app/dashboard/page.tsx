'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useTickets } from '@/hooks/useTickets';
import KanbanBoard from '@/components/KanbanBoard';
import { StatCard } from '@/components/StatCard';
import { Plus, LogOut, LayoutDashboard } from 'lucide-react';

export default function Dashboard() {
  const { data: session } = useSession();
  const { useGetTickets, useGetStats } = useTickets();
  const [viewFilter, setViewFilter] = useState<'all' | 'mine'>('all');

  const {
    data: tickets,
    isLoading: ticketsLoading,
    isError: ticketsError,
  } = useGetTickets(viewFilter);

  const { data: stats, isLoading: statsLoading } = useGetStats();

  const isLoading = ticketsLoading || statsLoading;
  const isAgent = ['ADMIN', 'SUPPORT'].includes(session?.user?.role || '');

  // Loading State
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-indigo-600 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
            </div>
          </div>
          <p className="text-sm font-semibold text-slate-500 animate-pulse">
            Loading your workspace...
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (ticketsError) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-red-100 max-w-md">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">
            Connection Error
          </h2>
          <p className="text-slate-500 mb-4">
            We couldn&lsquo;t load your tickets. This might be a temporary
            network issue.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-indigo-600 font-semibold hover:underline"
          >
            Try Reloading
          </button>
        </div>
      </div>
    );
  }

  const getStatCount = (status: string) =>
    stats?.status_distribution?.find((s) => s.status === status)?.count;

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Navbar / Header */}
      <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              TicketFlow
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-sm font-bold text-slate-700 leading-none">
                {session?.user?.name || session?.user?.username || 'User'}
              </span>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                {session?.user?.role || 'User'}
              </span>
            </div>

            <Link
              href="/tickets/new"
              className="hidden md:inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 active:scale-95"
            >
              <Plus size={16} />
              New Ticket
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Tickets" value={stats?.total_tickets} />
          <StatCard
            title="Avg Resolution"
            value={stats?.avg_resolution_time}
            isTime
            accent="indigo"
          />
          <StatCard
            title="Open Issues"
            value={getStatCount('OPEN')}
            accent="blue"
          />
          <StatCard
            title="Resolved"
            value={getStatCount('RESOLVED')}
            accent="green"
          />
        </div>

        {/* Toolbar & Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-800">Board Overview</h2>

          <div className="flex items-center gap-3">
            {isAgent && (
              <div className="bg-white p-1 rounded-xl border border-slate-200 inline-flex items-center shadow-sm">
                {(['all', 'mine'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setViewFilter(filter)}
                    className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                      viewFilter === filter
                        ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {filter === 'all' ? 'All Tickets' : 'My Tickets'}
                  </button>
                ))}
              </div>
            )}

            {/* Mobile FAB for New Ticket */}
            <Link
              href="/tickets/new"
              className="md:hidden inline-flex items-center justify-center w-10 h-10 bg-indigo-600 text-white rounded-full shadow-lg"
            >
              <Plus size={20} />
            </Link>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="h-[calc(100vh-320px)] min-h-125">
          <KanbanBoard tickets={tickets || []} />
        </div>
      </main>
    </div>
  );
}
