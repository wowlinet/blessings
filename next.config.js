/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['trae-api-sg.mchost.guru'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig