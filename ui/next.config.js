const nextConfig = {
  transpilePackages: ["shared"],
  poweredByHeader: false,
  swcMinify: true,
  output: "standalone",
  typescript: { ignoreBuildErrors: true },
};


module.exports = nextConfig;
