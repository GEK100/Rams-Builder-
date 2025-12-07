import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/builder/",
          "/settings/",
        ],
      },
    ],
    sitemap: "https://rams.ictusflow.com/sitemap.xml",
  };
}
