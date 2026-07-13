import { renderToString } from "react-dom/server";
import { App } from "../src/App";
import { CaseStudyPage } from "../src/CaseStudyPage";
import { caseStudies, type CaseStudy } from "../src/case-studies";
import {
  buildCaseStudyStructuredData,
  buildRootStructuredData,
  rootSeo,
  SITE_URL,
} from "../src/seo";

const outputPath = new URL("../dist/index.html", import.meta.url);
const template = await Bun.file(outputPath).text();
const marker = '<div id="root"></div>';

if (!template.includes(marker)) {
  throw new Error("Could not find the Vite root marker in dist/index.html");
}

type PageSeo = {
  canonical: string;
  description: string;
  image: string;
  imageAlt: string;
  structuredData: object;
  title: string;
  type: "article" | "profile";
};

function replaceMeta(html: string, attribute: "name" | "property", key: string, value: string) {
  const pattern = new RegExp(`(<meta\\s+${attribute}="${key}"\\s+content=")[^"]*("\\s*/>)`);
  if (!pattern.test(html)) throw new Error(`Could not find ${attribute}=${key} in HTML template`);
  return html.replace(pattern, `$1${value}$2`);
}

function applySeo(html: string, seo: PageSeo) {
  let output = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${seo.title}</title>`)
    .replace(/(<link rel="canonical" href=")[^"]*(" \/>)/, `$1${seo.canonical}$2`)
    .replace(
      /<script id="structured-data" type="application\/ld\+json">[\s\S]*?<\/script>/,
      `<script id="structured-data" type="application/ld+json">${JSON.stringify(seo.structuredData)}</script>`,
    );

  output = replaceMeta(output, "name", "description", seo.description);
  output = replaceMeta(output, "property", "og:type", seo.type);
  output = replaceMeta(output, "property", "og:title", seo.title);
  output = replaceMeta(output, "property", "og:description", seo.description);
  output = replaceMeta(output, "property", "og:url", seo.canonical);
  output = replaceMeta(output, "property", "og:image", seo.image);
  output = replaceMeta(output, "property", "og:image:alt", seo.imageAlt);
  output = replaceMeta(output, "name", "twitter:title", seo.title);
  output = replaceMeta(output, "name", "twitter:description", seo.description);
  output = replaceMeta(output, "name", "twitter:image", seo.image);
  output = replaceMeta(output, "name", "twitter:image:alt", seo.imageAlt);

  if (seo.type === "article") {
    output = output.replace(/\s*<meta property="profile:(?:first_name|last_name)"[^>]*\/>/g, "");
  }

  return output;
}

function renderPage(html: string, body: string, seo: PageSeo) {
  return applySeo(html.replace(marker, `<div id="root">${body}</div>`), seo);
}

const rootRendered = renderToString(<App />);
await Bun.write(
  outputPath,
  renderPage(template, rootRendered, {
    ...rootSeo,
    structuredData: buildRootStructuredData(),
  }),
);

for (const study of caseStudies) {
  const rendered = renderToString(<CaseStudyPage study={study} />);
  const page = renderPage(template, rendered, {
    canonical: `${SITE_URL}${study.path}`,
    description: study.seoDescription,
    image: `${SITE_URL}${study.socialImage}`,
    imageAlt: study.socialImageAlt,
    structuredData: buildCaseStudyStructuredData(study as CaseStudy),
    title: study.seoTitle,
    type: "article",
  });
  const caseOutput = new URL(`../dist${study.path}index.html`, import.meta.url);
  await Bun.write(caseOutput, page);
}
