const fs = require("fs");
const path = require("path");

// Import the timer data functions (using require for Node.js compatibility)
const {
  getAllTimerDurations,
  formatDurationSlug,
} = require("../lib/timerData.cjs");

const BASE_URL = "https://www.deep-timer.com";

function generateSitemap() {
  const durations = getAllTimerDurations();
  const currentDate = new Date().toISOString();

  // Generate URLs for all timer pages
  const timerUrls = durations
    .map((minutes) => {
      const slug = formatDurationSlug(minutes);
      return `  <url>
    <loc>${BASE_URL}/${slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    })
    .join("\n");

  // Create the complete sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
${timerUrls}
</urlset>`;

  // Write sitemap to public directory
  const publicDir = path.join(__dirname, "..", "public");
  const sitemapPath = path.join(publicDir, "sitemap.xml");

  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(sitemapPath, sitemap, "utf8");

  console.log(`✓ Generated sitemap with ${durations.length + 1} URLs`);
  console.log(`✓ Sitemap saved to: ${sitemapPath}`);
  console.log(`✓ Accessible at: ${BASE_URL}/sitemap.xml`);
}

// Run the sitemap generation
generateSitemap();
