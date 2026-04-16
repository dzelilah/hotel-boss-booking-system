'use client';

import { useContext } from 'react';
import { KeycloakContext } from '@/components/auth/KeycloakProvider';

export function useAuth() {
  const context = useContext(KeycloakContext);
  if (!context) {
    throw new Error('useAuth must be used within a KeycloakProvider');
  }
  return context;
}
