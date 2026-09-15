"use client";

import React, { ReactNode, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, ChevronDown, Home, ExternalLink, ChevronRight } from 'lucide-react';

export interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface PortalLayoutProps {
  children: ReactNode;
  navItems: NavItem[];
  portalName: string;
  accent?: string;
}

export default function PortalLayout({ children, navItems, portalName, accent = '#f97316' }: PortalLayoutProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const current = navItems.find(
    (i) => pathname === i.href || pathname.startsWith(i.href + '/')
  );
  const isDetail = current ? pathname !== current.href : false;

  return (
    <div className="min-h-screen bg-[var(--background)] flex">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col fixed inset-y-0 left-0 z-20 bg-[var(--ink)]">
        <Link
          href="/"
          className="h-16 flex items-center px-5 gap-3 border-b border-white/10 hover:bg-white/5 transition-colors group"
          title="Back to homepage"
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: accent }}
          >
            L
          </div>
          <div className="leading-tight flex-1">
            <span className="font-bold text-white tracking-tight block">LMS</span>
            <span className="text-[10px] uppercase tracking-widest text-white/50 font-semibold">{portalName}</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-white/30 group-hover:text-white/70 transition-colors" />
        </Link>

        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-150 ${
                  isActive ? 'text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
                style={isActive ? { backgroundColor: accent } : undefined}
              >
                <item.icon className="w-[18px] h-[18px]" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-lg text-sm font-semibold text-white/70 hover:bg-white/5 hover:text-white transition-colors"
          >
            <Home className="w-[18px] h-[18px]" />
            Homepage
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-lg text-sm font-semibold text-white/70 hover:bg-white/5 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-[18px] h-[18px]" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-[var(--line)] sticky top-0 z-10 px-8 flex items-center justify-between">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm min-w-0" aria-label="Breadcrumb">
            <Link href="/" className="text-[var(--ink)]/50 hover:text-[var(--ink)] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[var(--ink)]/30 flex-shrink-0" />
            <span className={isDetail ? 'text-[var(--ink)]/50' : 'font-semibold text-[var(--ink)]'}>
              {current ? (
                isDetail ? <Link href={current.href} className="hover:text-[var(--ink)] transition-colors">{current.name}</Link> : current.name
              ) : portalName}
            </span>
            {isDetail && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-[var(--ink)]/30 flex-shrink-0" />
                <span className="font-semibold text-[var(--ink)] truncate">Details</span>
              </>
            )}
          </nav>

          {/* User menu */}
          <div className="relative flex-shrink-0" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-3 pl-2 pr-2 py-1.5 rounded-lg hover:bg-[var(--paper)] transition-colors"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white"
                style={{ backgroundColor: accent }}
              >
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-[var(--ink)] leading-tight">
                  {user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-[11px] text-[var(--ink)]/50 capitalize">{user?.role?.toLowerCase() || 'borrower'}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-[var(--ink)]/40 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 neo-card p-1.5 animate-scale-in z-20">
                <div className="px-3 py-2 border-b border-[var(--line)] mb-1">
                  <p className="text-sm font-semibold text-[var(--ink)] truncate">{user?.email}</p>
                  <p className="text-[11px] text-[var(--ink)]/50 uppercase tracking-wide mt-0.5">{user?.role}</p>
                </div>
                <Link
                  href="/"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-[var(--ink)]/80 hover:bg-[var(--paper)] transition-colors"
                >
                  <Home className="w-4 h-4" /> Homepage
                </Link>
                {navItems[0] && (
                  <Link
                    href={navItems[0].href}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-[var(--ink)]/80 hover:bg-[var(--paper)] transition-colors"
                  >
                    {React.createElement(navItems[0].icon, { className: 'w-4 h-4' })} {navItems[0].name}
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="flex items-center gap-2.5 w-full px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Log out
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-8 overflow-x-hidden">
          <div key={pathname} className="animate-fade-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
