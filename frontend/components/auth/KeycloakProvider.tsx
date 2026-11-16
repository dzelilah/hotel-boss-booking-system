'use client';

import React, { createContext, useEffect, useState, useCallback } from 'react';
import Keycloak from 'keycloak-js';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  useEffect(() => {
    const kc = getKeycloak();
    // Returning from the Keycloak login page? (Checked before init, which strips the hash.)
    const isLoginCallback = /[#&](state|code|session_state)=/.test(window.location.hash);
    kc.init({
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: typeof window !== 'undefined'
        ? `${window.location.origin}/silent-check-sso.html`
        : undefined,
      pkceMethod: 'S256',
    }).then((authenticated) => {
      // keycloak-js strips the OIDC response (#state=...&code=...) from the URL, but Next's
      // router restores its own copy of the URL; replace it through the router so it sticks.
      if (isLoginCallback) {
        router.replace(window.location.pathname + window.location.search, { scroll: false });
      }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- init Keycloak exactly once
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
