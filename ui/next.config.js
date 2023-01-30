/** @type {import('next').NextConfig} */

import { join } from "path";
const nextConfig = {
  transpilePackages: ['shared'],
  experimental: {
    appDir: true,
    outputFileTracingRoot: join(__dirname, '../')
  },
  output: 'standalone'
}

export default nextConfig
