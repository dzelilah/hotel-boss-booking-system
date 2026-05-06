'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';

interface RoleGuardProps {
  children: React.ReactNode;
  roles: string[];
  redirectTo?: string;
}

export function RoleGuard({ children, roles, redirectTo = '/' }: RoleGuardProps) {
  const { initialized, isAuthenticated, hasRole } = useAuth();
  const router = useRouter();

  const hasRequiredRole = roles.some(role => hasRole(role));

  useEffect(() => {
    if (initialized && (!isAuthenticated || !hasRequiredRole)) {
      router.replace(redirectTo);
    }
  }, [initialized, isAuthenticated, hasRequiredRole, router, redirectTo]);

  if (!initialized || !isAuthenticated || !hasRequiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
