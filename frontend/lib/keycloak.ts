import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8180',
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'hotelboss',
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'hotel-frontend',
};

let keycloakInstance: Keycloak | null = null;

export const getKeycloak = (): Keycloak => {
  if (!keycloakInstance) {
    keycloakInstance = new Keycloak(keycloakConfig);
  }
  return keycloakInstance;
};

export default getKeycloak;
