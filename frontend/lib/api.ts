import axios from 'axios';
import { getKeycloak } from './keycloak';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  try {
    const keycloak = getKeycloak();
    if (keycloak.authenticated) {
      await keycloak.updateToken(30);
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
  } catch {
    // Not authenticated, proceed without token for public endpoints
  }
  return config;
});

export default api;
