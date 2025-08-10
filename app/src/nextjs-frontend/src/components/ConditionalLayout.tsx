'use client'

import { usePathname } from 'next/navigation';
import ClientLayout from './ClientLayout';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Check if we're on an auth page
  const isAuthPage = pathname?.startsWith('/auth');
  
  if (isAuthPage) {
    // Render auth pages without ClientLayout (no sidebar/header)
    return <div className="auth-wrapper">{children}</div>;
  }
  
  // Render all other pages with ClientLayout (with sidebar/header)
  return (
    <ClientLayout>
      {children}
    </ClientLayout>
  );
}