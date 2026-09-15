import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

export default function DisbursementLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'DISBURSEMENT']}>
      <div className="flex min-h-screen bg-gray-50 flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-gray-900 text-white flex flex-col">
          <div className="flex h-16 items-center px-6 border-b border-gray-800">
            <h1 className="text-xl font-bold tracking-tight">LMS Disbursement</h1>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            <Link href="/disbursement/loans" className="block px-4 py-2 rounded-md bg-gray-800 text-white font-medium transition-colors hover:bg-gray-700">
              Disbursement Queue
            </Link>
            <Link href="/dashboard" className="block px-4 py-2 mt-8 rounded-md text-gray-300 font-medium transition-colors border border-gray-700 hover:bg-gray-800 hover:text-white">
              Back to User Switcher
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-12 overflow-y-auto">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
