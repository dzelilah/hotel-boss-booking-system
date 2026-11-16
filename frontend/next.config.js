/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use NEXT_DIST_DIR (see package.json dev:fresh) if .next/trace is locked on Windows.
  ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),
  output: 'standalone',
  // Pin tracing to this package so Docker and local builds both emit server.js at standalone root
  outputFileTracingRoot: __dirname,
};

module.exports = nextConfig;
