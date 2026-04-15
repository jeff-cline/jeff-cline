import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["mongodb", "bcryptjs", "jsonwebtoken", "tesseract.js", "tesseract.js-core"],
  async redirects() {
    return [
      {
        source: "/fast-start-agreement",
        destination: "https://signnow.com/s/vvKOpkZX",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
