"use client";

import { ReactNode, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
}

export default function Modal({ open, onClose, title, description, icon, children, footer }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    // focus the first field so the dialog is usable from the keyboard
    const t = setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>('input, textarea, button')?.focus();
    }, 20);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      clearTimeout(t);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="absolute inset-0 bg-[var(--ink)]/45 backdrop-blur-[2px] animate-fade-up"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className="relative neo-card w-full max-w-md animate-scale-in"
        style={{ boxShadow: '0 40px 80px -24px rgba(15,32,51,0.45)' }}
      >
        <div className="flex items-start gap-4 p-6 pb-4">
          {icon && <div className="flex-shrink-0 mt-0.5">{icon}</div>}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-[var(--ink)] tracking-tight">{title}</h2>
            {description && (
              <p className="mt-1.5 text-sm text-[var(--ink)]/60 leading-relaxed">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1.5 -mt-1 -mr-1 rounded-lg text-[var(--ink)]/40 hover:text-[var(--ink)] hover:bg-[var(--paper)] transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {children && <div className="px-6 pb-2">{children}</div>}

        {footer && (
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 px-6 py-4 mt-2 border-t border-[var(--line)] bg-[var(--paper)] rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
