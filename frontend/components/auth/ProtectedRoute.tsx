'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { PageLoading } from '@/components/ui/PageLoading';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/** Sends visitors to the Keycloak login; they come back to the same URL (query string included). */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { initialized, isAuthenticated, login } = useAuth();

  useEffect(() => {
    if (initialized && !isAuthenticated) {
      login();
    }
  }, [initialized, isAuthenticated, login]);

  if (!initialized || !isAuthenticated) {
    return <PageLoading label="Preusmjeravanje na prijavu…" />;
  }

  return <>{children}</>;
}
