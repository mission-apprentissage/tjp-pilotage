/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */

const path = require("path");
const { withSentryConfig } = require("@sentry/nextjs");

const nextConfig = {
  transpilePackages: ["shared"], // 'server'
  poweredByHeader: false,
  swcMinify: true,
  experimental: {
    outputFileTracingRoot: path.join(__dirname, "../"),
  },
  output: "standalone",
  // typescript: { ignoreBuildErrors: true },
};

module.exports = withSentryConfig(
  nextConfig,
  {
    silent: true,
    org: "betagouv",
    project: "orion-ui",
    url: "https://sentry.incubateur.net/",
    authToken: process.env.NEXT_PUBLIC_SENTRY_AUTH_TOKEN,
    release: process.env.NEXT_PUBLIC_SENTRY_RELEASE?.replace("/", "-").replace(" ", "-"),
    errorHandler: (err) => {
      console.warn(err);
    },
  },
  {
    widenClientFileUpload: true,
    transpileClientSDK: true,
    tunnelRoute: "/monitoring",
    hideSourceMaps: true,
    disableLogger: true,
    automaticVercelMonitors: true,
  }
);
