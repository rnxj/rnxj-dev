# rnxj.dev

Reuel Nixon's portfolio, built with React, TypeScript, Vite, GSAP, and Lenis.

## Local development

```sh
bun install
bun dev
```

## Quality checks

```sh
bun run check
bun run check-types
bun run build
```

## Deployment

The production site is deployed to Cloudflare Workers Static Assets through Wrangler. The custom domain is declared in `wrangler.jsonc`, so deployment and routing remain reproducible from source.

```sh
# Validate the Worker bundle without publishing it
bun run deploy:dry-run

# Build and deploy rnxj.dev
bun run deploy
```
