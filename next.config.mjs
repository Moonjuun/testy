/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ["ko", "en", "ja", "vi"],
    defaultLocale: "ko",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
