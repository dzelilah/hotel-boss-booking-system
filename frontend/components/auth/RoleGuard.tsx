'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { PageLoading } from '@/components/ui/PageLoading';

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
    return <PageLoading />;
  }

  return <>{children}</>;
}
