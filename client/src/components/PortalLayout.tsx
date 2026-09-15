"use client";

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Search, LogOut, ChevronDown, Sparkles } from 'lucide-react';

export interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface PortalLayoutProps {
  children: ReactNode;
  navItems: NavItem[];
  portalName: string;
  accent?: string; // hex color for the active-state / glow tint
}

export default function PortalLayout({ children, navItems, portalName, accent = '#7c3aed' }: PortalLayoutProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[var(--background)] flex">
      {/* Sidebar */}
      <aside
        className="w-64 flex-shrink-0 flex flex-col fixed inset-y-0 left-0 z-20 text-slate-200"
        style={{ background: 'linear-gradient(190deg, var(--ink-950), var(--ink-900) 55%, var(--ink-800))' }}
      >
        <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />

        <div className="relative h-16 flex items-center px-6 gap-3 border-b border-white/5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-glow animate-gradient"
            style={{ backgroundImage: 'linear-gradient(135deg, #7c3aed, #db2777, #6366f1)' }}
          >
            L
          </div>
          <div className="leading-tight">
            <span className="font-bold text-white tracking-tight block">LMS</span>
            <span className="text-[11px] uppercase tracking-widest text-slate-400">{portalName}</span>
          </div>
        </div>

        <nav className="relative flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden ${
                  isActive
                    ? 'text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                style={isActive ? { backgroundColor: `${accent}26`, boxShadow: `inset 0 0 0 1px ${accent}55` } : undefined}
              >
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full"
                    style={{ backgroundColor: accent }}
                  />
                )}
                <item.icon
                  className="w-[18px] h-[18px] transition-transform group-hover:scale-110"
                  style={{ color: isActive ? accent : undefined }}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="relative p-3 border-t border-white/5">
          <div className="mb-3 rounded-xl p-3 glass-dark flex items-center gap-2 text-[11px] text-slate-400">
            <Sparkles className="w-3.5 h-3.5" style={{ color: accent }} />
            Secured by JWT + RBAC
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
          >
            <LogOut className="w-[18px] h-[18px]" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="h-16 bg-white/70 backdrop-blur-xl border-b border-black/5 sticky top-0 z-10 px-8 flex items-center justify-between">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" style={{ color: undefined }} />
              <input
                type="text"
                placeholder="Search applications, documents..."
                className="w-full bg-slate-100/80 border-none rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:bg-white transition-all outline-none"
                style={{ boxShadow: undefined }}
              />
            </div>
          </div>

          <div className="flex items-center gap-5 ml-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-700 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-white" style={{ backgroundColor: accent }}></span>
            </button>

            <div className="flex items-center gap-3 pl-5 border-l border-slate-200">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-md"
                style={{ backgroundImage: `linear-gradient(135deg, ${accent}, #db2777)` }}
              >
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-slate-900 leading-tight">
                  {user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-slate-500 capitalize">{user?.role?.toLowerCase() || 'Borrower'}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-x-hidden">
          <div key={pathname} className="animate-fade-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
