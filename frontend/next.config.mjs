/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/py/:path*",
        destination:
          process.env.INTERNAL_API_URL
            ? `${process.env.INTERNAL_API_URL}/:path*`
            : "http://127.0.0.1:8000/:path*",
      },
    ];
  },
};

export default nextConfig;
