export const identity = {
  name: "Reuel Nixon",
  role: "Full-stack product engineer",
  location: "Chennai, India",
  positioning:
    "Full-stack product engineer who moves quickly from idea to working software. I like owning features end-to-end, building clean product experiences, and using AI as leverage to iterate faster without skipping the engineering.",
  heroPositioning:
    "I move quickly from idea to working software. I own features end to end, build clean product experiences, and use AI as leverage without skipping the engineering.",
  bio: "Full-stack engineer building SaaS, tools, and fast experiments with AI as leverage.",
  tagline: ["Build fast.", "Understand deeply.", "Keep shipping."],
  email: "reuelnixon@gmail.com",
  links: {
    github: "https://github.com/rnxj",
    linkedin: "https://linkedin.com/in/reuelnixon",
    x: "https://x.com/_rnxj",
    instagram: "https://instagram.com/_rnxj",
    schedule: "https://cal.com/reuel",
  },
} as const;

export const luxe = {
  name: "Luxe PMS",
  description:
    "Property-management suite for residential communities — staff web portal + resident mobile app.",
  status: "Live admin portal · Resident app not yet released",
  live: "https://luxe-app.hangar.rnxj.dev",
  facts: [
    ["48", "Postgres tables"],
    ["20", "tRPC sub-routers"],
    ["35", "native screens"],
  ],
  detail:
    "The Luxe Assistant uses 9 tools. Every write action runs through the same RBAC, validation, and transactions as the UI. Real-time conversations stream over SSE with an ownership check.",
  storage: "Private S3-compatible object storage · RustFS in production",
  stack: ["Bun", "TypeScript", "Expo", "Hono", "tRPC", "PostgreSQL"],
  screens: ["01-home", "02-packages", "03-amenities", "04-community", "05-maintenance"],
} as const;

export const victoriousMinistries = {
  name: "Victorious Ministries",
  description:
    "Bilingual church app for a Tamil ministry — scripture that speaks, even when the app is closed.",
  status: "Coming soon · Store submission configured",
  live: "https://victoriousministries.hangar.rnxj.dev",
  facts: [
    ["31", "owner-verified Tamil clips"],
    ["0", "background JS"],
    ["5", "magazine languages"],
  ],
  detail:
    "Thirty-one owner-verified Tamil Bible verses play as notification sounds, even with the app killed and zero background JavaScript. The app and its notifications share the same rotation logic, so every verse stays in sync.",
  stack: ["Expo", "React Native", "TypeScript", "React Compiler", "content.json"],
  screens: [
    "01-verses",
    "02-videos",
    "03-magazine",
    "04-schedule",
    "05-video-detail",
    "06-settings",
  ],
} as const;

export const projects = [
  {
    index: "03",
    name: "Duck Hunt: Unplugged",
    description: "The classic NES Duck Hunt — reimagined with hand tracking.",
    subline: "No controller needed. Just your webcam and a pinch.",
    stack: ["Vanilla TypeScript", "PixiJS v8", "MediaPipe", "Web Audio API"],
    live: "https://duckhunt.rnxj.dev",
    liveLabel: "Play the game",
    source: "https://github.com/rnxj/duckhunt-unplugged",
    media: "video",
  },
  {
    index: "04",
    name: "PhonePe Payment Gateway for Next.js",
    description:
      "A Next.js 15 integration for PhonePe Standard Checkout with the official Node SDK: payment initiation, status verification, webhook callbacks, result pages, paisa handling, and sandbox/production configuration.",
    stack: ["Next.js 15", "PhonePe Node SDK", "Standard Checkout"],
    live: "https://phonepe-nextjs-demo.rnxj.dev/",
    liveLabel: "Open demo",
    source: "https://github.com/rnxj/phonepe-pg-nextjs",
    media: "phonepe",
  },
  {
    index: "05",
    name: "Warewise",
    description:
      "Workflow automation for a furniture-sector client, built to reduce manual operations, track operational state, and improve process visibility.",
    stack: ["TanStack Start", "Cloudflare Workers"],
    live: "https://j-one.app",
    liveLabel: "Visit live site",
    media: "warewise",
  },
] as const;

export const experience = [
  {
    company: "Keygraph",
    role: "Software Engineer",
    dates: "Jan 2025–Present",
    location: "Remote",
    highlights: [
      "Built autonomous pentesting agents with the Claude Agent SDK and Pi harness that reason over vulnerabilities, plan attack paths, and run exploit-and-retest loops end-to-end.",
      "Orchestrated long-running agent workflows on Temporal (Go/TypeScript): durable execution, retries, human-in-the-loop checkpoints.",
      "Built the LLM layer on Bifrost (multi-provider gateway) and Langfuse (observability), with eval harnesses to score finding quality and catch regressions.",
      "Ran the stack as self-hosted infra (gateway, observability, Temporal, Postgres) for data isolation across multi-tenant deployments on AWS/Cloudflare.",
      "Owned the platform's Next.js surfaces, backed by Connect gRPC and GraphQL Yoga services with sqlc and Atlas.",
    ],
  },
  {
    company: "BalkanID (Copilot)",
    role: "Software Development Intern",
    dates: "Nov 2023–Oct 2024",
    location: "Remote",
    highlights: [
      "Built a Next.js Copilot chatbot for identity, entitlement, and access-review data, backed by Go APIs and Python workflows, with CI/CD across Docker, Serverless Framework, GitHub Actions, ArgoCD, and AWS.",
    ],
  },
  {
    company: "Clarium Tech (Dokimes)",
    role: "ML Intern",
    dates: "Aug–Sep 2023",
    location: "Chennai",
    highlights: [
      "Built ML-assisted dummy-data generation for API testing fields and integrated it into the Dokimes testing workflow.",
    ],
  },
] as const;

export const education = {
  program: "B.Tech Computer Science",
  institution: "VIT Chennai",
  dates: "Aug 2021–May 2025",
  result: "GPA 9.0/10",
} as const;

export const skills = [
  ["Languages", ["TypeScript", "JavaScript", "Go", "Python", "SQL", "C", "C++", "Java"]],
  ["Frontend", ["React", "Next.js", "SvelteKit", "Astro", "Tailwind CSS", "shadcn/ui", "Zustand"]],
  ["Backend", ["Go", "Node.js", "Express", "Hono", "GraphQL Yoga", "Connect gRPC", "REST APIs"]],
  ["Databases", ["PostgreSQL", "MySQL", "MongoDB", "Neo4j", "Pinecone"]],
  [
    "Infra / Tools",
    [
      "AWS",
      "Cloudflare",
      "Docker",
      "Docker Compose",
      "ArgoCD",
      "GitHub Actions",
      "Serverless Framework",
      "Atlas",
      "sqlc",
    ],
  ],
  [
    "AI Workflow",
    [
      "Claude Code",
      "Codex",
      "Cursor",
      "Spec-Driven Development",
      "AI-assisted prototyping/debugging/refactoring",
    ],
  ],
] as const;
