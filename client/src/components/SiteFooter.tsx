import Link from 'next/link';

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Overview', href: '#product' },
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Why LMS', href: '#benefits' },
      { label: 'Security', href: '#security' },
    ],
  },
  {
    title: 'For borrowers',
    links: [
      { label: 'Apply for a loan', href: '/register' },
      { label: 'Track an application', href: '/login' },
      { label: 'Make a repayment', href: '/login' },
    ],
  },
  {
    title: 'For teams',
    links: [
      { label: 'Sanction console', href: '/login' },
      { label: 'Disbursement queue', href: '/login' },
      { label: 'Collections', href: '/login' },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="bg-[var(--ink)] text-white/60">
      <div className="mx-auto max-w-6xl px-6 lg:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: '#f97316' }}
              >
                L
              </div>
              <span className="font-bold text-lg tracking-tight text-white">LMS</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed max-w-xs">
              A loan management system covering the full lifecycle — application and eligibility
              through sanction, disbursement and collection.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-bold uppercase tracking-widest text-white/40">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.href.startsWith('#') ? (
                      <a href={l.href} className="text-sm hover:text-white transition-colors">{l.label}</a>
                    ) : (
                      <Link href={l.href} className="text-sm hover:text-white transition-colors">{l.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} LMS. Built as a full-stack loan management demo.
          </p>
          <p className="text-xs text-white/40">
            Next.js · Express · MongoDB · TypeScript
          </p>
        </div>
      </div>
    </footer>
  );
}
