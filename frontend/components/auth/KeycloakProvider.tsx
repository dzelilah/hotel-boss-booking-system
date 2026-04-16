'use client';

import React, { createContext, useEffect, useState, useCallback } from 'react';
import Keycloak from 'keycloak-js';
import { getKeycloak } from '@/lib/keycloak';

interface AuthContextValue {
  keycloak: Keycloak | null;
  initialized: boolean;
  isAuthenticated: boolean;
  user: { name?: string; email?: string; sub?: string } | null;
  roles: string[];
  token: string | undefined;
  login: () => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
}

export const KeycloakContext = createContext<AuthContextValue | null>(null);

export function KeycloakProvider({ children }: { children: React.ReactNode }) {
  const [keycloak, setKeycloak] = useState<Keycloak | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name?: string; email?: string; sub?: string } | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [token, setToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    const kc = getKeycloak();
    kc.init({
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: typeof window !== 'undefined'
        ? `${window.location.origin}/silent-check-sso.html`
        : undefined,
      pkceMethod: 'S256',
    }).then((authenticated) => {
      setKeycloak(kc);
      setInitialized(true);
      setIsAuthenticated(authenticated);
      if (authenticated && kc.tokenParsed) {
        const parsed = kc.tokenParsed as Record<string, unknown>;
        setUser({
          name: parsed['name'] as string | undefined,
          email: parsed['email'] as string | undefined,
          sub: parsed['sub'] as string | undefined,
        });
        const realmAccess = parsed['realm_access'] as { roles?: string[] } | undefined;
        setRoles(realmAccess?.roles ?? []);
        setToken(kc.token);
      }
    }).catch(() => {
      setInitialized(true);
    });
  }, []);

  const login = useCallback(() => {
    keycloak?.login();
  }, [keycloak]);

  const logout = useCallback(() => {
    keycloak?.logout({ redirectUri: typeof window !== 'undefined' ? window.location.origin : undefined });
  }, [keycloak]);

  const hasRole = useCallback((role: string) => {
    return roles.includes(role);
  }, [roles]);

  return (
    <KeycloakContext.Provider value={{
      keycloak,
      initialized,
      isAuthenticated,
      user,
      roles,
      token,
      login,
      logout,
      hasRole,
    }}>
      {children}
    </KeycloakContext.Provider>
  );
}
