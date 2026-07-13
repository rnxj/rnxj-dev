import { caseStudies, type CaseStudy } from "./case-studies";

export const SITE_URL = "https://rnxj.dev";
export const PROFILE_IMAGE_URL = `${SITE_URL}/media/avatar/portrait-signal-1254.webp`;
export const SOCIAL_IMAGE_URL = `${SITE_URL}/og.png`;

export const rootSeo = {
  canonical: `${SITE_URL}/`,
  description:
    "Reuel Nixon is a full-stack product engineer in Chennai, India, building web, mobile, SaaS, and AI-powered products. Available for work and freelance projects.",
  image: SOCIAL_IMAGE_URL,
  imageAlt: "Reuel Nixon, full-stack product engineer — rnxj.dev",
  title: "Reuel Nixon — Full-Stack Product Engineer",
  type: "profile",
} as const;

const sameAs = [
  "https://github.com/rnxj",
  "https://linkedin.com/in/reuelnixon",
  "https://x.com/_rnxj",
  "https://instagram.com/_rnxj",
];

const website = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: `${SITE_URL}/`,
  name: "Reuel Nixon",
  alternateName: "RNXJ",
  inLanguage: "en-IN",
};

const person = {
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: "Reuel Nixon",
  givenName: "Reuel",
  familyName: "Nixon",
  url: `${SITE_URL}/`,
  image: { "@id": `${SITE_URL}/#profile-image` },
  email: "reuelnixon@gmail.com",
  jobTitle: "Full-stack product engineer",
  description:
    "Full-stack product engineer who moves quickly from idea to working software, owns features end-to-end, and builds clean product experiences.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Chennai",
    addressCountry: "IN",
  },
  worksFor: {
    "@type": "Organization",
    name: "Keygraph",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "VIT Chennai",
  },
  knowsAbout: [
    "TypeScript",
    "JavaScript",
    "Go",
    "Python",
    "React",
    "Next.js",
    "React Native",
    "Hono",
    "PostgreSQL",
    "AWS",
    "Cloudflare",
  ],
  sameAs,
};

export function buildRootStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      website,
      {
        "@type": "ImageObject",
        "@id": `${SITE_URL}/#profile-image`,
        contentUrl: PROFILE_IMAGE_URL,
        width: 1254,
        height: 1254,
        caption: "Stylized portrait of Reuel Nixon",
      },
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/#profile-page`,
        url: `${SITE_URL}/`,
        name: rootSeo.title,
        description: rootSeo.description,
        inLanguage: "en-IN",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        mainEntity: { "@id": `${SITE_URL}/#person` },
        primaryImageOfPage: { "@id": `${SITE_URL}/#profile-image` },
        hasPart: caseStudies.map((study) => ({
          "@id": `${SITE_URL}${study.path}#case-study`,
        })),
      },
      person,
    ],
  };
}

export function buildCaseStudyStructuredData(study: CaseStudy) {
  const url = `${SITE_URL}${study.path}`;
  const image = study.gallery[0]
    ? `${SITE_URL}${study.gallery[0].base}-${study.gallery[0].widths[1]}.webp`
    : `${SITE_URL}/media/duckhunt/logo-360.webp`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      website,
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: study.seoTitle,
        description: study.seoDescription,
        inLanguage: "en-IN",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        mainEntity: { "@id": `${url}#case-study` },
      },
      {
        "@type": "CreativeWork",
        "@id": `${url}#case-study`,
        url,
        name: study.name,
        description: study.description,
        image,
        creator: { "@id": `${SITE_URL}/#person` },
        keywords: study.stack,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Reuel Nixon",
            item: `${SITE_URL}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: study.name,
            item: url,
          },
        ],
      },
      {
        "@type": "ImageObject",
        "@id": `${SITE_URL}/#profile-image`,
        contentUrl: PROFILE_IMAGE_URL,
        width: 1254,
        height: 1254,
        caption: "Stylized portrait of Reuel Nixon",
      },
      person,
    ],
  };
}
