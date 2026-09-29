# Portfolio v2

React implementation of `portfolio-draft.html`. The React app renders only the new design; the HTML file is retained as the original design reference and is not included in the production build.

## Local development

Use Node.js 22 or newer.

```sh
npm ci
npm start
```

## Verification

```sh
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

- `src/App.js`: hero, experience, stack, projects, quote, and footer markup.
- `src/App.css`: responsive styling and theme rules.
- `src/data/learningLog.js`: learning log entries.
- `src/data/contributions.js`: explicitly labeled **sample** contribution calendar, not live GitHub data.
- `src/components/Preferences.jsx`: saved settings and theme handling.
- `src/components/Settings.jsx`: settings sidebar.
- `src/components/FooterClock.jsx`: clock with the selected timezone; location label is based only on the device timezone.

Personal text, résumé and project links still contain draft placeholders. The visitor counter is not connected. The footer social links were carried over from the existing portfolio. Replace sample data before publishing as a finished personal portfolio.

## Dependency note

The existing Create React App 5 toolchain is retained. Compatible dependency updates removed the critical audit findings, but `npm audit` still reports 31 findings (9 low, 8 moderate, 14 high), principally in build/test tooling. A separate build-tool migration should address these; do not use `npm audit fix --force`, which proposes replacing `react-scripts` with an incompatible version. Production output is static assets, not the development server.
