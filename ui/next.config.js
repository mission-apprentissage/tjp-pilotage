/** @type {import('next').NextConfig} */

const path = require("path");

const nextConfig = {
  transpilePackages: ['shared'],
  experimental: {
    appDir: true,
    outputFileTracingRoot: path.join(__dirname, '../')
  },
  output: 'standalone'
}

module.exports = nextConfig
