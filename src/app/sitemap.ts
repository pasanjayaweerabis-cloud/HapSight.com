import type { MetadataRoute } from "next";
import { brand } from "@/content/site";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? brand.siteUrl;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/accessibility`, changeFrequency: "monthly", priority: 0.3 },
  ];
}
