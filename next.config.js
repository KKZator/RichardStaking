/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images:{
    domains: ['coral-acceptable-cardinal-937.mypinata.cloud'],
    unoptimized : true,
  },
  output: 'export',

}

module.exports = nextConfig
