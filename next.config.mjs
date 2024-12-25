/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",
  reactStrictMode: true,
  pageExtensions: ["tsx", "ts"],
  eslint: { ignoreDuringBuilds: true },
  env: {
    API_BASE_URL: process.env.API_BASE_URL
  },
  images: { domains: [process.env.BASE_DOMAIN], },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        options.defaultLoaders.babel,
        {
          loader: "@svgr/webpack",
          options: {
            icon: true,
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
