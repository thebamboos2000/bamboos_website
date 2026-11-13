# Security Architecture

The design matches the actual risk. Release 1 has no server endpoint, database, login or secrets, so most web application attacks have nothing to target. The main risks are misconfiguration, compromised dependencies, content or account takeover, and privacy mistakes.

> Client-side validation is **not** a security control. It improves usability. It's acceptable today only because no BAMBOOS server receives the data. Any future backend must validate everything again on the server.

## 1. Assets and threats

| Asset | Threat | Likelihood | Impact | Control |
|---|---|---|---|---|
| Domain and DNS | Account takeover leads to site hijack | Low | High | Business-owned account, MFA, registrar lock |
| GitHub / Vercel accounts | Malicious deployment | Low | High | MFA, branch protection, least privilege |
| WhatsApp number in config | Tampering redirects leads | Low | High | Pull request review, single source, E2E assertion |
| Dependencies | Supply-chain compromise | Medium | High | Lockfile, `npm ci`, audit, reviewed updates |
| Visitor enquiry data | Leakage through analytics or logs | Medium if careless | Medium | Not stored; analytics allowlist |
| Page content | XSS | Low (no user content rendered from others) | Medium | React escaping, escaped JSON-LD, CSP |
| Site in a frame | Clickjacking | Low | Low | `frame-ancestors 'none'` |
| Image optimiser | Resource abuse | Low | Low to medium | No remote hosts, limited sizes and qualities, spend alerts |
| Reputation | False claims on the site | Low | Medium | Verified-facts rule |
| Guest photos | Privacy and consent complaints | Medium | Medium | Rights and consent intake rule |

## 2. Current vs future requirements

| Control | Release 1 | With a backend |
|---|---|---|
| Client validation | UX only | UX only |
| Server validation | Not applicable | **Mandatory** |
| Rate limiting, bot protection | Not applicable | **Mandatory** |
| CSRF protection | Not applicable | Required for mutating endpoints |
| Authentication, authorisation | Not applicable | **Mandatory** for admin |
| Encryption at rest, retention | Not applicable | **Mandatory** |
| Audit logging | Not applicable | Required for staff actions |
| Secret management | No secrets exist | Server-only, per environment |
| Security headers | Yes | Yes, with stricter CSP on dynamic routes |
| Dependency management | Yes | Yes |

## 3. Input validation

| Input | Validation | Purpose |
|---|---|---|
| Enquiry fields | `enquirySchema`, with length limits and control characters removed | Data quality, bounded URL |
| `?event=` query value | Must match a known event id, otherwise ignored | Never rendered or trusted raw |
| Route `slug` | Must match content; otherwise `notFound()` | Only known pages exist |
| Environment variables | Zod in `config/env.ts`, fails at build | Prevents misconfiguration |

**About sanitisation.** The output contexts here are React text and a URL-encoded plain-text message, so the correct control is **context-appropriate encoding**, not HTML stripping. The design doesn't "sanitise" names by removing characters, which would damage legitimate input.

## 4. XSS prevention

- React escapes text by default.
- `dangerouslySetInnerHTML` is **banned except in the JSON-LD helper**, which uses only build-time data and escapes `<` as `<`, as the bundled Next.js guide recommends. Enforce with ESLint and review.
- User input is never placed into `href`, `src` or `style` without a generated, encoded form.
- WhatsApp text is encoded with `encodeURIComponent` exactly once.
- URLs in config and content are validated as `https:`, which excludes `javascript:`.
- Content is authored by the team, so there is no third-party HTML.

## 5. Privacy

### Data flow

| Stage | Where the data is | Who can see it |
|---|---|---|
| Typing the form | Browser memory | Visitor |
| Review step | Browser memory | Visitor |
| After clicking the link | The link is passed to `wa.me` and stored in browser history | Visitor, WhatsApp/Meta |
| After pressing Send | WhatsApp | Visitor, BAMBOOS staff, WhatsApp/Meta under its terms |

The website's own infrastructure receives **no form data**: it isn't sent to a BAMBOOS endpoint, and the text is in the query string of a request to `wa.me`, not to the site.

### Rules

- Collect only what's needed. No email, address or budget fields.
- Do not persist enquiry data: no `localStorage`, cookies or logs.
- No personal data in analytics. Page URLs must never contain personal data. The `?event=` value is a category id only.
- `rel="noopener noreferrer"` on external links.
- Show a short notice beside the form: it opens WhatsApp, data is shared only when the visitor sends it, an enquiry isn't a booking, and a link to `/privacy`.
- Staff handling matters more than the code here: enquiries persist on staff phones. Use WhatsApp Business on a business-controlled device, limit access, and define how long conversations are kept.

### Legal context

India's Digital Personal Data Protection Act, 2023 applies to digital personal data. The DPDP Rules, 2025 were notified in November 2025 with a phased rollout, and secondary sources place the main obligations around May 2027. Secondary sources differ by a day on exact dates, so check the gazette.

BAMBOOS, as the business deciding why enquiry data is used, should have **its own legal adviser review the privacy notice and staff practices**. This document is engineering guidance, not legal advice. Designing to these principles now (notice, minimal data, purpose limitation, a contact for requests, deletion on request) avoids rework later.

### Guest images

Wedding images show identifiable people, sometimes including children. Require photographer licence and subject consent before publication, provide a takedown contact, and strip location metadata.

## 6. Security headers

Set in `next.config.ts` with `headers()`, and covered by an E2E test. Re-verify on the first Vercel preview:

| Header | Value |
|---|---|
| `Content-Security-Policy` | See Section 7 |
| `Strict-Transport-Security` | `max-age=31536000`. Add `includeSubDomains` once the client's domain is confirmed, and `preload` only after a deliberate decision |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=()` |
| `X-Frame-Options` | `DENY`, for older browsers |

Also set `poweredByHeader: false`. Before enabling `includeSubDomains`, confirm that all subdomains of the client's domain support HTTPS.

## 7. Content Security Policy

```text
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' blob: data:;
media-src 'self';
font-src 'self';
connect-src 'self';
frame-src https://www.google.com https://www.youtube-nocookie.com;
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'none';
upgrade-insecure-requests;
```

Remove `frame-src` hosts that aren't used. `'unsafe-eval'` is added in development only, and `upgrade-insecure-requests` is added only on Vercel, because local production builds run on plain HTTP. Zod runs in `jitless` mode, so it doesn't probe for `eval`.

**Honest tradeoff: `'unsafe-inline'` in `script-src`.** Prerendered Next.js pages rely on inline scripts, which were confirmed in this phase's test build.

| Option | Assessment |
|---|---|
| Nonce-based CSP | Stronger, but per the bundled guide **requires dynamic rendering for all pages**, losing static performance and CDN caching |
| SRI (hash-based) | Keeps static generation, but is **experimental** in Next.js. Revisit when stable |
| **`'unsafe-inline'`** | **Selected.** The docs' documented approach without nonces. CSP still restricts script sources, framing, plugins, base URI and form targets |

Risk is accepted because the site renders no third-party content and has no session or stored data to steal. **Re-evaluate before adding admin features:** dynamic admin routes can use nonces.

The policy is enforced from the start, and an E2E test fails on any violation.

## 8. Other current controls

### External links and third parties

- `target="_blank"` always pairs with `rel="noopener noreferrer"`.
- The YouTube and Google Maps embeds load only after a click, so nothing is shared until the visitor chooses to view them. Embeds use `title`, `loading="lazy"` and a restrictive `sandbox` where it doesn't break them.
- No tag manager or marketing pixels. New third parties require review of performance, privacy notice and CSP.
- `images.remotePatterns` stays empty until a media CDN exists. Then it's limited to that exact host and path.
- Never expose internal network addresses to the optimiser. `dangerouslyAllowLocalIP` stays off.

### Environment variables

- Anything with `NEXT_PUBLIC_` is inlined into browser JavaScript and is **public**. Never put secrets there.
- Release 1 has no secrets.
- `.env*` stays ignored, with `!.env.example` added. `.env.example` holds names and safe defaults only.
- Validate at build time through `config/env.ts`.
- Values are set per environment in Vercel. If a secret ever leaks, rotate it: deleting it from Git doesn't remove it from history.

### Deployment and repository

- MFA for all GitHub, Vercel, registrar and DNS accounts. The business owns them, with developers invited.
- Protected `main`: pull requests and CI required, no force pushes.
- GitHub secret scanning and Dependabot alerts on.
- Least-privilege `permissions:` in GitHub Actions; actions pinned to a full commit SHA or trusted major version.
- HTTPS enforced by Vercel; HTTP redirects to HTTPS.
- Vercel spend alerts enabled to catch abuse or misconfiguration.
- Previews are protected or `noindex`. They contain no secret data in release 1.

### Dependencies

- `package-lock.json` committed; CI uses `npm ci`.
- `npm audit --omit=dev` in CI.
- Review new dependencies before adding: maintenance, size, purpose. Fewer is better.

## 9. Future backend security

> **Future requirements.** These must be in place **before** a backend goes live.

| Area | Requirement |
|---|---|
| Validation | Reuse `enquirySchema` on the server. Treat every Server Action and route as public. Enforce body size limits |
| Abuse prevention | Per-IP and per-phone rate limits (shared store such as Redis, not in-memory); honeypot; Cloudflare Turnstile or Vercel BotID; Vercel Firewall rules |
| Spam handling | Duplicate detection and review queue; never auto-reply to unverified numbers |
| Authentication | Established provider, MFA for staff, secure cookies (`HttpOnly`, `Secure`, `SameSite`), no self-built password handling |
| Authorisation | Checked in a `server-only` data access layer on every operation. `proxy` redirects are for convenience, not security. Roles: `staff`, `admin` |
| Injection | Parameterised queries or ORM |
| Data protection | TLS, encryption at rest, field minimisation, retention schedule, automated deletion, export and deletion on request |
| Secrets | Server-only variables, per-environment values, rotation |
| Logging | Structured, no personal data, staff action audit trail, error tracking with data scrubbing |
| Backups | Automated, encrypted, and restore-tested |
| CSP | Nonce-based on dynamic admin routes |
| Admin isolation | `noindex`, not linked publicly, separate route group |
| Incident response | Named owner, breach-notification procedure matching DPDP obligations |
| Testing | Authorisation tests per role; dependency and secret scanning; penetration test before handling bookings at scale |

## 10. Reporting

Add a security contact to the repository (a `security.txt` or the business contact) when a monitored address exists.
