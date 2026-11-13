# Project Scope

**Project:** BAMBOOS Premium Auditorium Website
**Business:** BAMBOOS, an auditorium, wedding venue and event destination in Aluva, Ernakulam, Kerala, India

## 1. Business objectives

| # | Objective | Measure of success |
|---|---|---|
| O1 | Present a premium digital image | Client acceptance against approved design |
| O2 | Attract customers through local search | Search Console impressions and clicks for target terms; baselines set after launch |
| O3 | Convert visitors into enquiries | WhatsApp handoff click rate; enquiries reported by staff |
| O4 | Answer common questions before contact | Facilities, capacity and location are reachable within two clicks from any page |

No numeric growth targets are set because no baseline exists yet. Set them after 60–90 days of data.

## 2. Target users

| User | Main need | What the site must offer |
|---|---|---|
| Couples planning a wedding | Inspiration, confidence, suitability | Gallery, wedding page, easy mobile enquiry |
| Families organising engagements and receptions | Capacity, location, facilities, often on a phone | Clear facts, directions, click to call or chat |
| Family members organising from abroad | Remote evaluation | Rich media, international phone numbers in the form |
| Wedding planners | Fast logistics facts | Capacity, infrastructure, direct contact |
| Corporate and conference organisers | Suitability and professional confidence | Corporate page, infrastructure |
| Private event organisers | Whether the venue suits their event | Event types, enquiry option |
| BAMBOOS staff | Clear, structured enquiries | Consistently formatted WhatsApp message |

## 3. Business rule: enquiry vs booking

An **enquiry** is a visitor's request for information. A **booking** is an agreement confirmed by BAMBOOS staff. In release 1 the website creates neither a booking nor a reservation, and it never displays or implies availability, confirmation or pricing commitments.

## 4. Functional requirements

| ID | Requirement | Priority | Where designed | Verified by |
|---|---|---|---|---|
| FR1 | Wedding, engagement, reception, birthday, corporate and conference showcases | Must | `/celebrations`, `/celebrations/[slug]` | E2E, content review |
| FR2 | Capacity and infrastructure information | Must | `/venue`, `config`, `content` | Verification register |
| FR3 | Facilities and amenities | Must | `/facilities` | Verification register |
| FR4 | Booking enquiry form | Must | `enquiries` feature on `/contact` | Unit, component and E2E tests |
| FR5 | WhatsApp integration | Must | `services/whatsapp.ts`, site-wide action | Unit, E2E, real-device test |
| FR6 | Premium photo and video gallery | Must | `/gallery`, media architecture | Component and E2E tests, Lighthouse |
| FR7 | Venue location and contact details | Must | `/contact`, footer | E2E, verification register |
| FR8 | SEO and local search visibility | Must | SEO layer | Rich Results Test, sitemap and metadata tests |
| FR9 | Responsive, mobile-first experience | Must | All layouts | Playwright device projects |
| FR10 | Preselect event type from category pages | Should | `?event=` on `/contact` | Component and E2E tests |
| FR11 | Gallery filter by category | Should | `GalleryExplorer` | Unit and E2E tests |
| FR12 | Privacy notice | Must | `/privacy` | Legal review |

## 5. Non-functional requirements

| ID | Attribute | Requirement | Verification |
|---|---|---|---|
| NFR1 | Performance | Mobile p75: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1. Lighthouse Performance ≥ 90 | Lighthouse CI, field data |
| NFR2 | Accessibility | WCAG 2.2 AA; Lighthouse Accessibility ≥ 95 | axe, manual pass |
| NFR3 | SEO | Unique metadata per page; valid structured data; Lighthouse SEO ≥ 95 | Tests, validators |
| NFR4 | Security | Security headers present; no secrets in the client; no personal data stored | Header test, review |
| NFR5 | Privacy | Enquiry data sent only on the visitor's action; none in analytics | Code review, E2E network assertion |
| NFR6 | Maintainability | Strict TypeScript; lint boundaries; each fact defined once | CI |
| NFR7 | Reliability | Static hosting; failed builds never reach production; rollback within minutes | Deployment process |
| NFR8 | Compatibility | Browsers supported by Next.js 16; widths from 360 px | Playwright projects |
| NFR9 | Cost | No paid services at launch other than hosting and domain | Stack review |
| NFR10 | Content integrity | Launch blocked if required facts are unverified | `check:launch` |

## 6. In scope (release 1)

- Pages: Home, Venue, Celebrations, six category pages, Gallery, Facilities, Contact, Privacy.
- Enquiry form with validation and WhatsApp handoff.
- Site-wide contact actions: WhatsApp and call.
- Photo gallery with filter and lightbox; video display.
- SEO layer, sitemap, robots, structured data.
- Security headers, 404 and error pages.
- Test suite, CI, preview and production deployment.
- Analytics, if BAMBOOS approves.
- Handover documentation.

**This current phase** covers architecture and documentation only.

## 7. Out of scope (release 1)

| Item | Reason |
|---|---|
| Online booking, payment, deposits | Business process remains with staff |
| Availability calendar | Requires reliable booking data |
| Backend, database, accounts, admin area | No current requirement justifies them |
| CMS | Evaluate after launch |
| Malayalam or other translations | Assumed English first; revisit with evidence |
| Automated WhatsApp replies, WhatsApp Business API | Click-to-chat is sufficient. API adds cost and approvals |
| Email notifications | No server component |
| Google Business Profile management | Business activity, though a critical dependency |
| Photography, videography, copywriting | Client or supplier deliverables unless separately agreed |

## 8. Content verification register

**No value below has been supplied or verified.** Do not invent, estimate or copy these from third-party listings. BAMBOOS must provide each one and name who confirmed it.

| Fact | Launch required | Status | Used in |
|---|---|---|---|
| Legal/trading name and relationship to "BK Events" | Yes | ☐ Pending | Footer, privacy, JSON-LD |
| Full street address and PIN code | Yes | ☐ Pending | Contact, footer, JSON-LD |
| Map coordinates / Google Maps link | Yes | ☐ Pending | Contact, JSON-LD |
| Primary phone number | Yes | ☐ Pending | Contact, footer, JSON-LD |
| WhatsApp number | Yes | ☐ Pending | Enquiry flow, site-wide action |
| Email | No | ☐ Pending | Contact |
| Enquiry response hours | Yes | ☐ Pending | Contact |
| Opening hours | No | ☐ Pending | JSON-LD |
| Halls, and capacity per hall and seating style | Yes | ☐ Pending | Venue |
| Parking capacity | No | ☐ Pending | Venue, facilities |
| Facilities and amenities list | Yes | ☐ Pending | Facilities |
| Event types actually offered | Yes | ☐ Pending | Celebrations, form |
| Social media links | No | ☐ Pending | Footer, JSON-LD `sameAs` |
| Logo and brand guidelines | Yes | ☐ Pending | Site-wide |
| Licensed photography and video, with consent | Yes | ☐ Pending | Site-wide |
| Primary domain | Yes | ☐ Pending | Canonicals, deployment |
| Data contact for privacy requests | Yes | ☐ Pending | Privacy notice |

## 9. Assumptions

These need client confirmation. If one proves false, the affected design must be revisited.

1. BAMBOOS has a single location.
2. English is sufficient for release 1.
3. WhatsApp is an acceptable primary enquiry channel, and staff monitor it within published hours.
4. Content changes are infrequent, so a developer-managed update process is acceptable at launch.
5. BAMBOOS holds, or can get, rights to all media.
6. The gallery will have fewer than about 300 images at launch.
7. Pricing is not published.
8. Most visitors arrive on mobile. This is an industry-based assumption, to be checked against analytics.
9. "BK Events" (the project folder name) is related to the business, but the relationship has not been stated.

## 10. Dependencies

| Dependency | Owner | Impact if late |
|---|---|---|
| Verified facts (Section 8) | BAMBOOS | Launch blocked |
| Media and rights | BAMBOOS / photographer | Design quality and launch |
| Brand direction | BAMBOOS / designer | Visual design |
| Domain and DNS access | BAMBOOS | Launch |
| Vercel Pro account and billing | BAMBOOS | Production deployment |
| GitHub repository | Development team | Implementation start |
| Google Business Profile | BAMBOOS | Local SEO effectiveness |
| Privacy notice legal review | BAMBOOS | Launch |

## 11. Future enhancements

Not committed. See [ARCHITECTURE.md](ARCHITECTURE.md#21-scalability-strategy) for triggers.

Enquiry management · admin dashboard · email notifications · gallery CMS · facility management · customer management · booking management · availability calendar · analytics dashboard · Malayalam content · testimonials (real and with consent) · virtual tour.

## 12. Acceptance criteria for release 1

- [ ] All Must requirements are met.
- [ ] All CI gates pass, and `check:launch` passes.
- [ ] Lighthouse targets are met on production-like builds with real media.
- [ ] Real-device WhatsApp test passes on Android, iOS and desktop WhatsApp Web, including Malayalam text.
- [ ] Manual keyboard and screen reader pass is complete.
- [ ] Structured data validates.
- [ ] BAMBOOS signs off the content register and privacy notice.
- [ ] Domain, HTTPS and rollback are verified.
