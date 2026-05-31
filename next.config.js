/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: isProd ? '/market' : '',
  assetPrefix: isProd ? '/market/' : '',
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'via.placeholder.com', 'picsum.photos'],
  },
}

module.exports = nextConfig
