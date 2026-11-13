# ADR-005: WhatsApp-Based Enquiry Integration

**Status:** Accepted · **Date:** 2026-11-05

## Context

The primary conversion is an enquiry. The brief requires a form that continues through WhatsApp with a preformatted message, and enquiries must not be confused with confirmed bookings.

## Decision

Use WhatsApp's documented click-to-chat link: `https://wa.me/<number>?text=<url-encoded text>`.

1. The visitor completes a client-side form, validated by a shared Zod schema.
2. Pure services format the message and generate the URL.
3. The visitor sees a **review step with a real link**, and opens WhatsApp by clicking it.
4. The visitor presses Send in WhatsApp.

Other rules:

- The site has no enquiry endpoint or storage.
- The encoded URL length is budgeted, because Malayalam text expands about 9× when encoded.
- International numbers are accepted.
- Direct phone and WhatsApp links remain available in static HTML.
- The form, message and privacy notice all state that an enquiry isn't a booking.

## Alternatives considered

| Option | Why not |
|---|---|
| `window.open` or redirect on submit | Popup-blocker risk, and no chance to review the message |
| WhatsApp Business Platform API | Requires a server, approvals, templates and messaging costs. Not justified for click-to-chat |
| Email form service | Adds a third party holding personal data, and misses the preferred channel |
| Own backend now | Database, spam protection and retention obligations before a proven need |
| Third-party chat widget | Script weight, privacy concerns, and it doesn't add enough value |
| An `EnquiryGateway` interface | One implementation. A plain function is enough |

## Consequences

**Positive:** No backend or running cost. The site holds no personal data. Staff use a familiar tool. It's quick to build and test.

**Negative:**

- **The site can't know whether a message was sent.** Analytics measure intent only.
- Enquiries have no central record or reporting, and staff handling depends on WhatsApp.
- Dependence on a single number and an external link format with no service guarantee.
- Visitors without WhatsApp need another route, so phone is always shown.
- Requires JavaScript for the form, though direct links don't.

**Migration path.** Add a Server Action that saves first, then keep the WhatsApp step. `enquirySchema` and the services are reused. See [API_DESIGN.md](../API_DESIGN.md#3-proposed-future-enquiry-api).
