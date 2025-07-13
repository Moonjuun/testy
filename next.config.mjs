/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google 프로필 이미지
      },
      {
        protocol: "https",
        hostname: "xxlvfknsbwfjyzdlucyz.supabase.co", // Supabase Storage 이미지
      },
    ],
  },
};

export default nextConfig;
