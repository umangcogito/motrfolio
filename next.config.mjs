/** @type {import('next').NextConfig} */
const nextConfig = {
  // heic-convert loads libheif via wasm at runtime; keep it out of the bundle.
  experimental: {
    serverComponentsExternalPackages: ["heic-convert", "libheif-js"],
  },
};

export default nextConfig;
