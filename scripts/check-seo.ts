import { caseStudies } from "../src/case-studies";
import { rootSeo, SITE_URL } from "../src/seo";

type ExpectedPage = {
  canonical: string;
  file: string;
  image: string;
  imageAlt: string;
  title: string;
};

const pages: ExpectedPage[] = [
  {
    canonical: rootSeo.canonical,
    file: "../dist/index.html",
    image: rootSeo.image,
    imageAlt: rootSeo.imageAlt,
    title: rootSeo.title,
  },
  ...caseStudies.map((study) => ({
    canonical: `${SITE_URL}${study.path}`,
    file: `../dist${study.path}index.html`,
    image: `${SITE_URL}${study.socialImage}`,
    imageAlt: study.socialImageAlt,
    title: study.seoTitle,
  })),
];

const seenTitles = new Set<string>();
const seenCanonicals = new Set<string>();

for (const expected of pages) {
  const html = await Bun.file(new URL(expected.file, import.meta.url)).text();
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
  const description = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1];
  const ogTitle = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i)?.[1];
  const ogDescription = html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i)?.[1];
  const ogUrl = html.match(/<meta\s+property="og:url"\s+content="([^"]+)"/i)?.[1];
  const ogImage = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i)?.[1];
  const ogImageAlt = html.match(/<meta\s+property="og:image:alt"\s+content="([^"]+)"/i)?.[1];
  const twitterTitle = html.match(/<meta\s+name="twitter:title"\s+content="([^"]+)"/i)?.[1];
  const twitterDescription = html.match(
    /<meta\s+name="twitter:description"\s+content="([^"]+)"/i,
  )?.[1];
  const twitterImage = html.match(/<meta\s+name="twitter:image"\s+content="([^"]+)"/i)?.[1];
  const twitterImageAlt = html.match(/<meta\s+name="twitter:image:alt"\s+content="([^"]+)"/i)?.[1];
  const imageWidth = html.match(/<meta\s+property="og:image:width"\s+content="([^"]+)"/i)?.[1];
  const imageHeight = html.match(/<meta\s+property="og:image:height"\s+content="([^"]+)"/i)?.[1];
  const structuredData = html.match(
    /<script id="structured-data" type="application\/ld\+json">([\s\S]*?)<\/script>/,
  )?.[1];

  if (title !== expected.title) throw new Error(`Unexpected title in ${expected.file}`);
  if (canonical !== expected.canonical) throw new Error(`Unexpected canonical in ${expected.file}`);
  if (ogTitle !== expected.title || twitterTitle !== expected.title) {
    throw new Error(`Social title mismatch in ${expected.file}`);
  }
  if (ogDescription !== description || twitterDescription !== description) {
    throw new Error(`Social description mismatch in ${expected.file}`);
  }
  if (ogUrl !== expected.canonical) throw new Error(`Social URL mismatch in ${expected.file}`);
  if (ogImage !== expected.image || twitterImage !== expected.image) {
    throw new Error(`Social image mismatch in ${expected.file}`);
  }
  if (ogImageAlt !== expected.imageAlt || twitterImageAlt !== expected.imageAlt) {
    throw new Error(`Social image alt mismatch in ${expected.file}`);
  }
  if (imageWidth !== "1200" || imageHeight !== "630") {
    throw new Error(`Social image dimensions are missing in ${expected.file}`);
  }
  const imagePath = expected.image.slice(SITE_URL.length);
  if (!(await Bun.file(new URL(`../dist${imagePath}`, import.meta.url)).exists())) {
    throw new Error(`Social image file is missing for ${expected.file}`);
  }
  if (!description || description.length < 80) {
    throw new Error(`Missing or weak description in ${expected.file}`);
  }
  if (!html.includes('name="robots"') || !html.includes("max-image-preview:large")) {
    throw new Error(`Missing robots preview controls in ${expected.file}`);
  }
  if (!structuredData) throw new Error(`Missing JSON-LD in ${expected.file}`);
  JSON.parse(structuredData);
  if (!/<h1(?:\s|>)/.test(html)) throw new Error(`Missing H1 in ${expected.file}`);
  if (/<meta\s+name="keywords"/i.test(html))
    throw new Error(`Meta keywords found in ${expected.file}`);
  if (
    expected.canonical !== rootSeo.canonical &&
    /<meta\s+property="profile:(?:first_name|last_name)"/i.test(html)
  ) {
    throw new Error(`Profile-only Open Graph fields found in ${expected.file}`);
  }
  if (seenTitles.has(title)) throw new Error(`Duplicate title: ${title}`);
  if (seenCanonicals.has(canonical)) throw new Error(`Duplicate canonical: ${canonical}`);
  seenTitles.add(title);
  seenCanonicals.add(canonical);
}

const rootHtml = await Bun.file(new URL("../dist/index.html", import.meta.url)).text();
const sitemap = await Bun.file(new URL("../dist/sitemap.xml", import.meta.url)).text();
const robots = await Bun.file(new URL("../dist/robots.txt", import.meta.url)).text();
const rootH1 = rootHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1];
const rootH1Text = rootH1
  ?.replace(/<!--[\s\S]*?-->/g, "")
  .replace(/<[^>]+>/g, "")
  .replace(/\s+/g, " ")
  .trim();

if (rootH1Text !== "REUEL NIXON") {
  throw new Error(`Homepage H1 must expose the spaced full name, received: ${rootH1Text}`);
}
if (!rootHtml.includes('alt="Stylized portrait of Reuel Nixon"')) {
  throw new Error("Homepage portrait is missing its identity alt text");
}

for (const study of caseStudies) {
  if (!rootHtml.includes(`href="${study.path}"`)) {
    throw new Error(`Homepage does not link to ${study.path}`);
  }
  if (!sitemap.includes(`<loc>${SITE_URL}${study.path}</loc>`)) {
    throw new Error(`Sitemap does not include ${study.path}`);
  }
}

if (!robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`)) {
  throw new Error("robots.txt does not advertise the canonical sitemap");
}

console.log(`SEO checks passed for ${pages.length} canonical pages.`);
