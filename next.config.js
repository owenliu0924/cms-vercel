/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['y5tg9gdnxyenwazf.public.blob.vercel-storage.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig