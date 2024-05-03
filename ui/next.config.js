/** @type {import('next').NextConfig} */

// eslint-disable-next-line @typescript-eslint/no-var-requires
// const path = require("path");

const nextConfig = {
  transpilePackages: ['shared', 'server'],
  experimental: {},
  typescript:{ ignoreBuildErrors: true }
}

module.exports = nextConfig
