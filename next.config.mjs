/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
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
    qualities: [75, 90], // Next.js 16: 허용할 이미지 품질 레벨
  },
};

export default nextConfig;
