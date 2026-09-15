"use client";

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Search, LogOut, ChevronDown } from 'lucide-react';

export interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface PortalLayoutProps {
  children: ReactNode;
  navItems: NavItem[];
  portalName: string;
  accent?: string; // hex color for the active-state tint
}

export default function PortalLayout({ children, navItems, portalName, accent = '#f97316' }: PortalLayoutProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[var(--background)] flex">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col fixed inset-y-0 left-0 z-20 bg-[var(--ink)] border-r border-[var(--line)]">
        <div className="h-16 flex items-center px-5 gap-3 border-b-[3px] border-white/10">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--ink)] font-bold text-lg border-2 border-white"
            style={{ backgroundColor: accent }}
          >
            L
          </div>
          <div className="leading-tight">
            <span className="font-bold text-white tracking-tight block">LMS</span>
            <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold">{portalName}</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-bold border-2 transition-all duration-150 ${
                  isActive
                    ? 'text-white border-transparent'
                    : 'text-white/70 border-transparent hover:bg-white/5 hover:text-white'
                }`}
                style={isActive ? { backgroundColor: accent } : undefined}
              >
                <item.icon className="w-[18px] h-[18px]" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t-[3px] border-white/10">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-lg text-sm font-bold text-white/70 border-2 border-transparent hover:border-[var(--danger)] hover:text-[var(--danger)] transition-colors"
          >
            <LogOut className="w-[18px] h-[18px]" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="h-16 bg-[var(--paper)] border-b border-[var(--line)] sticky top-0 z-10 px-8 flex items-center justify-between">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <Search className="w-4 h-4 text-[var(--ink)]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search applications, documents..."
                className="w-full bg-white border border-[var(--line)] rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-5 ml-4">
            <button className="relative p-2 text-[var(--ink)] hover:opacity-70 transition-opacity">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-[var(--paper)]" style={{ backgroundColor: accent }}></span>
            </button>

            <div className="flex items-center gap-3 pl-5 border-l-2 border-[var(--ink)]/15">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-[var(--ink)] border border-[var(--line)]"
                style={{ backgroundColor: accent }}
              >
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-bold text-[var(--ink)] leading-tight">
                  {user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-[var(--ink)]/50 uppercase tracking-wide font-semibold">{user?.role?.toLowerCase() || 'Borrower'}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-[var(--ink)]/50" />
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
