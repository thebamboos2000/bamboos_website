# Deployment Architecture

**Status:** the application is ready to deploy, but the repository has no remote yet and no Vercel project exists.

## 1. Environment architecture

| Environment | Where | Purpose | URL | Indexed | Data |
|---|---|---|---|---|---|
| **Development** | Developer machine, `npm run dev` | Daily work | `localhost:3000` | No | Test facts locally only |
| **Preview** | Vercel, one per pull request and branch | Review, client sign-off, E2E checks | Unique `*.vercel.app` | No | Same verified facts as production |
| **Production** | Vercel, `main` | Public site | Client domain | Yes | Verified facts |

There's no permanent staging environment. Per-PR previews serve that purpose at no extra cost, and a static site has no environment-specific backend to mirror.

## 2. End-to-end workflow

1. Developer branches from `main`, and runs local checks.
2. Push and open a pull request.
3. GitHub Actions runs [quality gates](TESTING_STRATEGY.md#6-quality-gates), and Vercel builds a preview.
4. Reviewer checks the code and preview. BAMBOOS reviews content changes on the preview URL.
5. Squash merge to `main`, once required checks pass.
6. Vercel builds and promotes the production deployment automatically.
7. Run the post-deployment smoke check.

## 3. Git workflow

**Trunk-based with short-lived branches.** GitFlow would add ceremony without benefit for a small team.

| Item | Convention |
|---|---|
| Default branch | `main`, protected. The local repository is currently on `master` and needs renaming |
| Branch names | `feat/gallery-filter`, `fix/whatsapp-encoding`, `content/facilities-list`, `docs/adr-009` |
| Commits | Conventional Commits, for example `feat(enquiries): add handoff review step` |
| Merge | Squash, with linear history |
| Branch protection | Pull request and required checks; no force pushes or deletion |
| Releases | Every merge to `main` deploys. Tag milestones such as `v1.0.0` |

### Repository setup

These are for when implementation starts. Each needs the owner's go-ahead, since they create external resources.

```bash
git branch -m master main
```

```bash
gh repo create <owner>/bamboo-website --private --source=. --remote=origin --push
```

## 4. Preview deployments

- Created automatically for each pull request.
- `robots.ts` disallows all crawling, because `VERCEL_ENV` isn't `production`.
- Canonicals use the production domain. A preview can never compete as the canonical page.
- Enable Vercel Deployment Protection if content is confidential before launch. If protected, configure the bypass for automated checks that target previews.

## 5. Production deployments

| Step | Control |
|---|---|
| Trigger | Merge to `main` |
| Build | `next build`; failure leaves the current production deployment live |
| Activation | Atomic: visitors get either the old or new version |
| Smoke check | Automated or manual, below |

**Post-deployment smoke check:**

- [ ] `/`, `/contact`, `/gallery` return 200 and display correctly on mobile.
- [ ] An unknown URL returns 404.
- [ ] The WhatsApp link contains the correct number.
- [ ] `sitemap.xml` and `robots.txt` are correct for production.
- [ ] Security headers are present.

## 6. Domain setup

Exact values come from the Vercel domain dashboard at setup. Don't copy DNS values from documents.

1. BAMBOOS registers or confirms ownership of the domain in a **business-owned account** with MFA and auto-renew.
2. Add both apex and `www` to the Vercel project. Choose one as primary, and redirect the other with a permanent redirect.
3. Add the DNS records shown by Vercel at the DNS provider. Lower TTL ahead of the cutover, if the domain is in use.
4. Vercel provisions and renews TLS certificates. HTTP redirects to HTTPS.
5. If an existing site or email uses the domain, record existing DNS first, **keep MX and email records unchanged**, and plan redirects from old URLs.
6. Set `NEXT_PUBLIC_SITE_URL` to the primary domain.
7. Verify the domain in Google Search Console, submit the sitemap, and align the Google Business Profile website link.

## 7. Environment configuration

| Variable | Development | Preview | Production |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Production domain, so canonicals stay correct | Production domain |
| `VERCEL_ENV` | Unset | `preview` (automatic) | `production` (automatic) |

`.env.example`:

```bash
# Public, inlined into browser JavaScript. Never place secrets in NEXT_PUBLIC_ variables.
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Rules**

- Local values go in `.env.local`, which is never committed.
- `NEXT_PUBLIC_*` values are fixed at build. Changing them in Vercel requires a redeploy.
- Build fails if a required variable is invalid.
- Pin the Node version in `.nvmrc`, `package.json` `engines` and the Vercel project.

## 8. Build verification

| Stage | Verifies |
|---|---|
| Local | Dev server, type check, lint, tests |
| CI | Clean install, all gates, static-only gate |
| Vercel | Production build in the hosting environment |
| Preview | Real platform behaviour: headers, image optimiser, video |
| Release | `check:launch`, smoke check |

**Launch gate.** Run `npm run check:launch` before the first production release, and whenever facts change. Make it a required check on `main` once content is complete. It cannot be required earlier, or every pull request would fail while facts are pending.

## 9. Rollback strategy

| Situation | Action | Speed |
|---|---|---|
| Bad release | **Vercel Instant Rollback** to a previous production deployment | Seconds to minutes, no rebuild |
| After rollback | Fix forward, or `git revert` on a new pull request, so `main` matches intent | Normal PR flow |
| Wrong business fact, urgent | Roll back, or fast-tracked one-line config fix | Minutes |
| Bad DNS change | Restore the recorded previous DNS values | Depends on TTL |
| Domain or account compromise | Revoke sessions, rotate access, restore from Git history, contact the registrar and Vercel | Incident |

Important details:

- Check the Vercel behaviour at setup: after an Instant Rollback, auto-assignment of new production deployments may pause until production is explicitly reassigned. Include this in the runbook.
- Because the site has no database, **rollback has no data migration risk**. This stops being true once a backend exists, when expand-and-contract migrations become necessary.
- Test a rollback once before launch.

## 10. Monitoring and analytics

| Need | Tool | Status |
|---|---|---|
| Traffic and conversions | Vercel Web Analytics with allowlisted events | Recommended, needs approval |
| Field Core Web Vitals | Vercel Speed Insights, or `useReportWebVitals` | Recommended |
| Uptime | External HTTP check with alert to a named contact | Recommended |
| Search health | Google Search Console | Required |
| Local presence | Google Business Profile insights | Required (business) |
| Cost | Vercel usage alerts and spend limit | Required |
| Dependencies | Dependabot or Renovate | Required |
| Client-side errors | Not at launch. Consider error tracking if errors appear or a backend is added | Deferred |

**Weekly at first, then monthly:** check analytics, Search Console coverage, Web Vitals and usage costs. **Periodically** send a test enquiry through the live path by arrangement with staff, because a dead WhatsApp number fails silently.

## 11. Ownership and handover

| Asset | Recommended owner |
|---|---|
| Domain and DNS | BAMBOOS |
| Vercel team and billing | BAMBOOS, with developers as members |
| GitHub organisation | BAMBOOS, with developers as members |
| Google Search Console and Business Profile | BAMBOOS |
| WhatsApp Business account | BAMBOOS |

The client must not be locked out of their own site if a developer leaves. Store recovery details in the business's password manager.

## 12. Hosting cost and portability

Vercel's fair use guidelines restrict Hobby to non-commercial personal use, so this business site needs **Pro or above**. Confirm current pricing and included image-transformation usage at setup. See [ADR-008](ADR/ADR-008-hosting-plan.md).

Because every route is static, the application isn't locked to Vercel. Moving requires re-implementing only headers, previews and image optimisation.
