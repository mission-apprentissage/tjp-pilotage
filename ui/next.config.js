/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */

const path = require("path");

export default {
  transpilePackages: ["shared"],
  poweredByHeader: false,
  swcMinify: true,
  experimental: {
    outputFileTracingRoot: path.join(__dirname, "../"),
  },
  output: "standalone",
  typescript: { ignoreBuildErrors: true },
};
