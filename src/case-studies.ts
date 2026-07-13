export type CaseStudyLink = {
  href: string;
  label: string;
};

export type CaseStudySection = {
  paragraphs: readonly string[];
  title: string;
};

export type CaseStudyGalleryImage = {
  alt: string;
  base: string;
  height: number;
  widths: readonly [number, number];
  width: number;
};

export type CaseStudy = {
  description: string;
  eyebrow: string;
  facts: ReadonlyArray<readonly [string, string]>;
  gallery: readonly CaseStudyGalleryImage[];
  index: string;
  links: readonly CaseStudyLink[];
  name: string;
  path: string;
  sections: readonly CaseStudySection[];
  seoDescription: string;
  socialImage: string;
  socialImageAlt: string;
  seoTitle: string;
  slug: string;
  stack: readonly string[];
  status: string;
  visual: "phones" | "duckhunt" | "phonepe";
};

export const caseStudies = [
  {
    slug: "luxe-pms",
    path: "/work/luxe-pms/",
    index: "01",
    eyebrow: "Engineering case study",
    name: "Luxe PMS",
    description:
      "Property-management suite for residential communities — staff web portal + resident mobile app.",
    status: "Live, invite-only admin portal · Resident app not yet released",
    seoTitle: "Luxe PMS Engineering Case Study | Reuel Nixon",
    seoDescription:
      "How Reuel Nixon built Luxe PMS as an end-to-end TypeScript property-management suite with Expo, Hono, tRPC, PostgreSQL, and an AI concierge.",
    socialImage: "/media/seo/luxe-pms.png",
    socialImageAlt: "Luxe PMS engineering case study by Reuel Nixon",
    facts: [
      ["48", "PostgreSQL tables"],
      ["20", "tRPC sub-routers"],
      ["35", "native screens"],
    ],
    stack: [
      "Bun 1.3",
      "Turborepo",
      "TypeScript",
      "Expo SDK 56",
      "React Native 0.85",
      "Hono 4",
      "tRPC 11",
      "PostgreSQL",
      "Drizzle",
    ],
    sections: [
      {
        title: "One TypeScript system",
        paragraphs: [
          "Luxe PMS is an end-to-end TypeScript monorepo built with Bun 1.3 and Turborepo. The staff portal uses TanStack Router and Vite, the resident app uses Expo SDK 56 and React Native 0.85, and the Hono 4 server exposes tRPC 11 on Bun.",
          "The product spans 19 authenticated staff pages and 35 native screens across five tab groups, backed by 48 Drizzle PostgreSQL tables, 38 enums, and 20 tRPC sub-routers.",
        ],
      },
      {
        title: "AI actions under the same rules",
        paragraphs: [
          "The Luxe Assistant uses Vercel AI SDK v6 with Gemini 2.5 Flash and nine tools for packages, maintenance, reservations, amenities, booking, and escalation.",
          "Write tools delegate through appRouter.createCaller, so AI actions hit the same RBAC, validation, and transactions as the UI. Sessions are revalidated on every tool call, with a layered system prompt and prompt-injection guard.",
        ],
      },
      {
        title: "State that stays safe",
        paragraphs: [
          "Realtime conversations stream over SSE with per-conversation pub/sub and an ownership-check security contract. Better Auth provides an organization model, property roles, building-level scoping, and invite-only access.",
          "Amenity booking uses SELECT … FOR UPDATE inside a transaction before overlap and capacity checks. The e-signature module adds hash-chained audit events, SHA-256 document hashes, a sealed PDF, and a certificate of completion.",
          "Private files use S3-compatible object storage (RustFS in production), with MIME allowlists, upload limits, and tiered presigned URLs.",
        ],
      },
    ],
    links: [{ href: "https://luxe-app.hangar.rnxj.dev", label: "Open invite-only admin portal" }],
    gallery: [
      {
        base: "/media/luxe/01-home",
        alt: "Luxe resident app home screen with packages, maintenance, quick actions, and amenities",
        width: 1320,
        height: 2868,
        widths: [440, 660],
      },
      {
        base: "/media/luxe/02-packages",
        alt: "Luxe resident app package-tracking screen",
        width: 1320,
        height: 2868,
        widths: [440, 660],
      },
      {
        base: "/media/luxe/03-amenities",
        alt: "Luxe resident app amenities screen",
        width: 1320,
        height: 2868,
        widths: [440, 660],
      },
    ],
    visual: "phones",
  },
  {
    slug: "victorious-ministries",
    path: "/work/victorious-ministries/",
    index: "02",
    eyebrow: "Engineering case study",
    name: "Victorious Ministries",
    description:
      "Bilingual church app for a Tamil ministry — scripture that speaks, even when the app is closed.",
    status: "Coming soon · Store submission configured",
    seoTitle: "Victorious Ministries React Native Case Study | Reuel Nixon",
    seoDescription:
      "How Reuel Nixon built a Tamil ministry app whose Bible verses play as native notification sounds with the app killed and zero background JavaScript.",
    socialImage: "/media/seo/victorious-ministries.png",
    socialImageAlt: "Victorious Ministries React Native case study by Reuel Nixon",
    facts: [
      ["31", "verified Tamil clips"],
      ["0", "background JavaScript"],
      ["5", "magazine languages"],
    ],
    stack: [
      "Expo SDK 56",
      "React Native 0.85",
      "React 19",
      "TypeScript",
      "React Compiler",
      "expo-router",
      "content.json",
    ],
    sections: [
      {
        title: "Notifications the OS can play",
        paragraphs: [
          "Thirty-one owner-verified Tamil Bible-verse clips play as notification sounds. The operating system plays the audio, so it works with the app killed and zero background JavaScript.",
          "The source material began as 33 unlabeled Tamil clips. They were transcribed offline with mlx-whisper using whisper-large-v3-turbo on Apple Silicon, then owner-verified into 31 unique verses.",
        ],
      },
      {
        title: "One rotation, two engines",
        paragraphs: [
          "A weekly engine schedules up to 63 repeating weekday-and-hour triggers, while a daily engine uses a day-number-seeded rotation. The split works around iOS’s 64-pending-notification cap, with pickEvenly thinning when needed.",
          "Android uses one immutable-sound channel per verse inside a Bible verses group. The interface and notification scheduler share the same rotation logic, so the verse shown in the app stays aligned with the verse the OS plays.",
        ],
      },
      {
        title: "Content without an app release",
        paragraphs: [
          "Videos load without an API key through YouTube channel RSS, ytInitialData, and InnerTube continuation paging, with an offline cache. Magazine issues are available in Tamil, English, Hindi, Kannada, and Malayalam.",
          "There is no backend. The ministry edits one content.json file on its site, and the app uses stale-while-revalidate so content can change without a new app release.",
        ],
      },
    ],
    links: [
      {
        href: "https://victoriousministries.hangar.rnxj.dev",
        label: "View app landing page",
      },
    ],
    gallery: [
      {
        base: "/media/victorious-ministries/01-verses",
        alt: "Victorious Ministries Tamil scripture and audio screen",
        width: 1284,
        height: 2778,
        widths: [428, 642],
      },
      {
        base: "/media/victorious-ministries/02-videos",
        alt: "Victorious Ministries videos screen",
        width: 1284,
        height: 2778,
        widths: [428, 642],
      },
      {
        base: "/media/victorious-ministries/03-magazine",
        alt: "Victorious Ministries multilingual magazine screen",
        width: 1284,
        height: 2778,
        widths: [428, 642],
      },
    ],
    visual: "phones",
  },
  {
    slug: "duck-hunt-unplugged",
    path: "/work/duck-hunt-unplugged/",
    index: "03",
    eyebrow: "Engineering case study",
    name: "Duck Hunt: Unplugged",
    description: "The classic NES Duck Hunt — reimagined with hand tracking.",
    status: "Live · Open source under MIT",
    seoTitle: "MediaPipe Hand-Tracking Game Case Study | Reuel Nixon",
    seoDescription:
      "How Reuel Nixon built Duck Hunt: Unplugged with MediaPipe hand tracking, PixiJS v8, WebGPU/WebGL, and pinch-to-shoot interaction in Vanilla TypeScript.",
    socialImage: "/media/seo/duck-hunt-unplugged.png",
    socialImageAlt: "Duck Hunt: Unplugged hand-tracking game case study by Reuel Nixon",
    facts: [
      ["Vanilla TypeScript", "codebase"],
      ["WebGPU/WebGL", "rendering"],
      ["×2–×5", "streak multipliers"],
    ],
    stack: ["Vanilla TypeScript", "PixiJS v8", "MediaPipe HandLandmarker", "Vite", "Web Audio API"],
    sections: [
      {
        title: "Aim with a hand. Shoot with a pinch.",
        paragraphs: [
          "No controller is needed. The game reads a webcam feed with MediaPipe HandLandmarker, smooths the aim position with linear interpolation, and turns a three-dimensional finger-distance gesture into a shot.",
          "Pinch detection uses hysteresis so a hand near the threshold does not flicker between states. Shots are edge-triggered, which means one pinch produces one shot instead of firing on every animation frame.",
        ],
      },
      {
        title: "A small, deliberate game loop",
        paragraphs: [
          "PixiJS v8 renders through WebGPU or WebGL, while the Web Audio API handles the sound layer. The game adds progressive difficulty, ×2–×5 streak multipliers, and a localStorage high score.",
          "The application is built in Vanilla TypeScript without a framework and released under the MIT license.",
        ],
      },
    ],
    links: [
      { href: "https://duckhunt.rnxj.dev", label: "Play the game" },
      { href: "https://github.com/rnxj/duckhunt-unplugged", label: "View source" },
    ],
    gallery: [],
    visual: "duckhunt",
  },
  {
    slug: "phonepe-nextjs",
    path: "/work/phonepe-nextjs/",
    index: "04",
    eyebrow: "Engineering case study",
    name: "PhonePe Payment Gateway for Next.js",
    description:
      "A Next.js 15 integration for PhonePe Standard Checkout with the official PhonePe Node SDK.",
    status: "Demo and public source available",
    seoTitle: "PhonePe Next.js Integration Case Study | Reuel Nixon",
    seoDescription:
      "See how Reuel Nixon built a Next.js 15 PhonePe Standard Checkout integration with payment initiation, status verification, webhooks, result pages, and paisa handling.",
    socialImage: "/media/seo/phonepe-nextjs-card.png",
    socialImageAlt: "PhonePe payment gateway for Next.js engineering case study by Reuel Nixon",
    facts: [
      ["Next.js 15", "framework"],
      ["Official SDK", "PhonePe integration"],
      ["2", "environments"],
    ],
    stack: ["Next.js 15", "PhonePe Node SDK", "Standard Checkout"],
    sections: [
      {
        title: "Checkout from request to result",
        paragraphs: [
          "The integration uses PhonePe Standard Checkout through the official pg-sdk-node package. It covers payment initiation, status verification, webhook callbacks, and result pages in a Next.js 15 application.",
        ],
      },
      {
        title: "Money and environments made explicit",
        paragraphs: [
          "Amounts are handled in paisa, and configuration supports both sandbox and production environments.",
          "The public repository contains the implementation, while the hosted demo provides a working interface for the integration flow.",
        ],
      },
    ],
    links: [
      { href: "https://phonepe-nextjs-demo.rnxj.dev/", label: "Open demo" },
      { href: "https://github.com/rnxj/phonepe-pg-nextjs", label: "View source" },
    ],
    gallery: [
      {
        base: "/media/projects/phonepe",
        alt: "Dark payment gateway demo with amount, order ID, payment, and status fields",
        width: 3382,
        height: 2102,
        widths: [720, 1440],
      },
    ],
    visual: "phonepe",
  },
] as const satisfies readonly CaseStudy[];

export function getCaseStudyByPath(pathname: string) {
  const normalizedPath = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return caseStudies.find((study) => study.path === normalizedPath);
}
