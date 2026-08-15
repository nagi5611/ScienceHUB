# AGENTS.md

## Cursor Cloud specific instructions

ScienceHUB is a Cloudflare Pages app (static frontend in `public/` + Pages Functions API in
`functions/api/`) backed by D1 (binding `DB`) and R2 (binding `FILES`), plus optional collab
Workers in `workers/`. There is no unit-test framework; the type checker is the primary
correctness gate. Standard commands live in `package.json` `scripts`; only the non-obvious
caveats are captured below.

### Dependencies
- The VM update script runs `npm ci --legacy-peer-deps`. `--legacy-peer-deps` is required:
  `@cloudflare/workers-types` is pinned to v4 in `package.json` but `wrangler` declares a v5
  peer, so a plain `npm ci`/`npm install` fails with `ERESOLVE`. Use `--legacy-peer-deps` for
  any manual install too.

### Generate binding types (needed before typecheck / dev)
- `npm run types` runs `wrangler types` and writes `worker-configuration.d.ts` (gitignored).
  `tsconfig.json` `include`s that file, so `npm run typecheck` fails on a fresh checkout until
  it exists. Re-run after editing `wrangler.jsonc`.

### Lint / build / test
- `npm run typecheck` (`tsc --noEmit`) is the lint/test gate. `npm run build` = `types` +
  `typecheck`. There are no automated tests.

### Local database (required before the API works)
- `npm run db:migrate:local` applies the `migrations/` SQL to the local D1 (persisted under
  `.wrangler/state`). The API returns errors against an empty DB until this runs. `pages dev`
  and this command share the default `.wrangler/state` persist dir.

### Running the app locally — important caveat
- Do NOT use a bare `npm run dev`. `wrangler.jsonc` declares two `remote: true` bindings
  (`sciencehub_db`, `sciencehub_files`). In a non-interactive VM (no `wrangler login` /
  `CLOUDFLARE_API_TOKEN`), wrangler aborts startup trying to open a remote proxy for them.
- The app code falls back with `env.DB ?? env.sciencehub_db` and
  `env.FILES ?? env.sciencehub_files`, so the local `DB`/`FILES` bindings are what actually get
  used. Override the two remote bindings to local so the server starts fully offline (and never
  touches production D1/R2):

  ```
  npm run dev -- --ip 0.0.0.0 --port 8788 \
    --d1 sciencehub_db=sciencehub-db \
    --r2 sciencehub_files=sciencehub-files
  ```

- `wrangler pages dev` also expects `.dev.vars` to exist; copy it once with
  `cp .dev.vars.example .dev.vars` (holds local-only Firebase/consent placeholders).

### Real-time collaboration (optional)
- Excalidraw/Design live collab needs the Durable Object workers bound via `npm run dev:all`.
  Without them, `/api/excalidraw` and `/api/design` return `503`; non-realtime save via D1/R2
  still works. All other external integrations (Google/Microsoft OAuth, Google Calendar, AWS
  FDS simulation, Gemini, Discord, Firebase SMS, R2 presigned URLs) are optional and
  feature-gated — the core app runs without any of their secrets.

### Smoke test
- New-user signup at `/login/` (サインアップ tab) creates a guest user in D1 and logs in with a
  session cookie — no OAuth/external secrets needed. `/api/health` reports D1 and R2 status.
