// Where each role lands after login, and where it is sent if it opens a page it can't access
export const ROLE_LANDING: Record<string, string> = {
  BORROWER: '/borrower/dashboard',
  ADMIN: '/admin/dashboard',
  SANCTION: '/sanction/dashboard',
  DISBURSEMENT: '/disbursement/dashboard',
  COLLECTION: '/collection/dashboard',
  SALES: '/sales/dashboard',
};
