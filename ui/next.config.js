/** @type {import('next').NextConfig} */

// eslint-disable-next-line @typescript-eslint/no-var-requires
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
