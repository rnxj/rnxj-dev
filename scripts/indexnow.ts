import { caseStudies } from "../src/case-studies";
import { SITE_URL } from "../src/seo";

const key = "7e9b4c1d8a6f2305c4d791b82ea6f3c0";
const urlList = [`${SITE_URL}/`, ...caseStudies.map((study) => `${SITE_URL}${study.path}`)];
const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: "rnxj.dev",
    key,
    keyLocation: `${SITE_URL}/${key}.txt`,
    urlList,
  }),
});

if (!response.ok) {
  throw new Error(`IndexNow submission failed with HTTP ${response.status}`);
}

console.log(`IndexNow accepted ${urlList.length} updated URLs (HTTP ${response.status}).`);
