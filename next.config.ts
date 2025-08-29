// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images:{
//     remotePatterns: [{protocol: 'https:', host: 'img.clerk.com'}],
//   }
// };

// export default nextConfig;


import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
        pathname: "/**", // Allow all paths from img.clerk.com
      },
    ],
  },
};

export default nextConfig;
