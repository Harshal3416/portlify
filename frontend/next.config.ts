import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/admin/products',
        permanent: false, // use true if you never want a '/' route ever
      },
    ];
  },
};

export default nextConfig;
