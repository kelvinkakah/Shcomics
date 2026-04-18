import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@shelby-protocol/ui"],
  typedRoutes: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.shelbynet.shelby.xyz",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "replicate.delivery",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pbxt.replicate.delivery",
        port: "",
        pathname: "/**",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        "@shelby-protocol/sdk",
        "@shelby-protocol/sdk/browser",
      ];
    }
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async",
    });
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    return config;
  },
};

export default nextConfig;
