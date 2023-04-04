/** @type {import('next').NextConfig} */
module.exports = {
  trailingSlash: false,
  reactStrictMode: true,
  experimental: { appDir: true },
  images: {
    domains: ['effigy.im'],
  },
};
