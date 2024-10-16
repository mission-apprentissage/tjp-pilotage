/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withSentryConfig } = require("@sentry/nextjs");

const nextConfig = {
  transpilePackages: ['shared', 'server'],
  experimental: {},
  typescript:{ ignoreBuildErrors: true }
}

module.exports = withSentryConfig(
  nextConfig,
  {
    silent: true,
    org: "betagouv",
    project: "orion-ui",
    url: "https://sentry.incubateur.net/",
    authToken: process.env.NEXT_PUBLIC_SENTRY_AUTH_TOKEN,
    release: process.env.NEXT_PUBLIC_SENTRY_RELEASE?.replace("/", "-").replace(" ", "-"),
    errorHandler: (err) => { console.warn(err) }
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
