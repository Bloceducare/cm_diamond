/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["github.com", "cdn.pixabay.com"],
  },
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },

  async headers() {
    return [
      {
        source: "/(.*)", // apply to all routes
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self';",
              "frame-ancestors 'self' https://*.walletconnect.org https://secure.walletconnect.org https://secure-mobile.walletconnect.org;",
              "frame-src 'self' https://*.walletconnect.org https://secure.walletconnect.org https://secure-mobile.walletconnect.org;",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.walletconnect.org;",
              "connect-src *;",
              "img-src * data: blob:;",
            ].join(" "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
