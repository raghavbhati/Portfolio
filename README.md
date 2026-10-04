# Portfolio v2

React implementation of `portfolio-draft.html`. The React app renders only the new design; the HTML file is retained as the original design reference and is not included in the production build.

## Local development

Use Node.js 22 or newer.

```sh
npm ci
npm start
```

## Verification

The app uses strict TypeScript. TypeScript 4.9 is retained for compatibility with Create React App 5.

```sh
npm run typecheck
CI=true npm test -- --watchAll=false --runInBand
npm run build
```

## Cloudflare Pages

`wrangler.toml` configures a **Pages** project named `resume-portfolio-v2` and the `build` output directory. Change the name if you create the Pages project with a different name.

For Git integration, connect this GitHub repository in Cloudflare Pages:

- Production branch: `resume-portfolio-v2`
- Build command: `npm run build`
- Build output directory: `build`
- Root directory: repository root
- Node version: 22 (also specified in `.node-version`)

For a local Pages preview:

```sh
npm run pages:dev
```

For an explicitly requested manual deployment after creating the Pages project and authenticating with Cloudflare:

```sh
npx wrangler login
npm run pages:deploy -- --branch=resume-portfolio-v2
```

The npm deploy script builds first and then runs Wrangler. To pass deployment flags explicitly, use `npm run build` followed by `npx wrangler pages deploy --branch=resume-portfolio-v2`.

No Cloudflare account IDs, API tokens, or credentials are committed. Configuring the custom domain and DNS, creating the Cloudflare project, and disabling the old hosting integration are separate account-level steps. They have not been performed by this code change. Cloudflare Pages automatically supports SPA fallback when there is no top-level `404.html`.

## Editing content

- `src/App.tsx`: hero, experience, stack, projects, quote, and footer markup.
- `src/index.css`: responsive styling, theme rules, and Tailwind configuration.
- `src/data/learningLog.ts`: learning log entries.
- `src/data/profile.ts`: project details and skills from main and the supplied résumé.
- `src/components/Preferences.tsx`: saved settings and theme handling.
- `src/components/Settings.tsx`: settings sidebar.
- `src/components/FooterClock.tsx`: clock with the selected timezone; location label is based only on the device timezone.

Personal content comes from the main branch and the supplied RaghavBhatiResume.pdf, available at `/RaghavBhatiResume.pdf`. Learning logs are retrospective work summaries, not dated journal entries. GitHub links to the résumé profile; live contribution counts and visitor analytics are not connected. Project URLs are carried over from main. The standalone `portfolio-draft.html` remains the original design reference; the React app is the current portfolio.

## Dependency note

The existing Create React App 5 toolchain is retained. Compatible dependency updates removed the critical audit findings, but `npm audit` still reports 32 findings (9 low, 7 moderate, 16 high), principally in build/test tooling. A separate build-tool migration should address these; do not use `npm audit fix --force`, which proposes replacing `react-scripts` with an incompatible version. Production output is static assets, not the development server.
