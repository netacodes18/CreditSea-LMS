"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import LandingNavActions from '@/components/LandingNavActions';

const LINKS = [
  { label: 'Product', href: '#product' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Why LMS', href: '#benefits' },
  { label: 'Security', href: '#security' },
];

export default function SiteHeader({ hasToken }: { hasToken?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled ? 'bg-[var(--paper)]/85 backdrop-blur-md border-b border-[var(--line)]' : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="mx-auto max-w-6xl px-6 lg:px-8 h-16 flex items-center justify-between gap-6" aria-label="Main">
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: '#f97316' }}
          >
            L
          </div>
          <span className="font-bold text-lg tracking-tight text-[var(--ink)]">LMS</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-[var(--ink)]/65 hover:text-[var(--ink)] px-3 py-2 rounded-lg hover:bg-[var(--ink)]/[0.04] transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:block flex-shrink-0">
          <LandingNavActions hasToken={hasToken} />
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 -mr-2 text-[var(--ink)] rounded-lg hover:bg-[var(--ink)]/[0.05] transition-colors"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-[var(--line)] bg-[var(--paper)] px-6 py-4 space-y-1">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block text-sm font-medium text-[var(--ink)]/75 px-3 py-2.5 rounded-lg hover:bg-[var(--ink)]/[0.04] transition-colors"
            >
              {l.label}
            </a>
          ))}
          <div className="pt-3 [&_a]:w-full [&>div]:flex-col [&>div]:items-stretch [&>div]:gap-2">
            <LandingNavActions hasToken={hasToken} />
          </div>
        </div>
      )}
    </header>
  );
}
