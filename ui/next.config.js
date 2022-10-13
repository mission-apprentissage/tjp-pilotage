function inline(value) {
  return value.replace(/\s{2,}/g, " ").trim();
}

const contentSecurityPolicy = `
      default-src 'self' https://plausible.io;
      base-uri 'self';
      block-all-mixed-content;
      font-src 'self' https: data:;
      frame-ancestors 'self';
      img-src 'self' https://www.notion.so data: ${
        process.env.NEXT_PUBLIC_ENV !== "production" ? "" : ""
      };
      object-src 'none';
      script-src 'self'  https://plausible.io ${process.env.NEXT_PUBLIC_ENV === "dev" ? "'unsafe-eval'" : ""};
      script-src-attr 'none';
      style-src 'self' https: 'unsafe-inline';
      upgrade-insecure-requests;
`;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    outputStandalone: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: inline(contentSecurityPolicy),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
