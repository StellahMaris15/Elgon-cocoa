import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const siteUrl = (process.env.VITE_SITE_URL || process.env.SITE_URL || "http://localhost:8080").replace(/\/$/, "");

const routes = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/about", priority: "0.8", changefreq: "monthly" },
  { path: "/products", priority: "0.9", changefreq: "weekly" },
  { path: "/products/vanilla-cured-beans", priority: "0.8", changefreq: "monthly" },
  { path: "/products/arabica-green-beans", priority: "0.8", changefreq: "monthly" },
  { path: "/products/cocoa-beans", priority: "0.8", changefreq: "monthly" },
  { path: "/farmers", priority: "0.8", changefreq: "weekly" },
  { path: "/contact", priority: "0.7", changefreq: "monthly" },
  { path: "/inquire", priority: "0.8", changefreq: "monthly" },
];

const today = new Date().toISOString().slice(0, 10);
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${siteUrl}${route.path === "/" ? "" : route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

const distDir = resolve("dist");
await mkdir(distDir, { recursive: true });
await writeFile(resolve(distDir, "sitemap.xml"), xml);
