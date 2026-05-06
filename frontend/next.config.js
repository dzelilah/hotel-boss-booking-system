/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Pin tracing to this package so Docker and local builds both emit server.js at standalone root
  outputFileTracingRoot: __dirname,
};

module.exports = nextConfig;
