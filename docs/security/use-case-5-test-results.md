# Use Case 5: Permission boundary test results

## Scope

Contest user APIs (`/api/contest/applications`, etc.) and admin APIs (`/api/contest/admin/*`).

## Code review findings

- Authentication enforced via `requireUser` (401 when missing session).
- App gates via `requireAppAccess` for `contest-entry` and `contest-management` slugs (403 when no membership; admins bypass via `userHasAdminRole`).
- Row-level access: `getContestApplicationForUser` returns null for other users' IDs (404).
- Admin delete: `deleteContestApplicationAsAdmin` checks `viewerCanManageContestApplications`.

## Automated checks

Run locally after `npm run db:migrate:local`:

```bash
npm run test:contest
```

## Follow-ups

See GitHub issues #102–#104 and #103 for E2E coverage, documentation, and hardening.
