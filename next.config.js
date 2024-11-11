/** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// };

module.exports = {
  reactStrictMode: true,

  async redirects() {
    return [
      {
        source: "/",
        destination: "/homepage",
        permanent: false,
      },
    ];
  },
  eslint: {
    // Since we are using production build for test server, we choose to ignore linting errors during
    // building. We can do so because we run the linter in other parts of our workflow.
    ignoreDuringBuilds: true,
  },
};
