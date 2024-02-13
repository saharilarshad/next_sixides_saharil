/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["image.tmdb.org"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
