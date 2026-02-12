/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://microlaunch-api.rajatdatta90000.workers.dev'
  }
}

module.exports = nextConfig
