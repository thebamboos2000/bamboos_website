# Integration and API Design

| Section | Status |
|---|---|
| Section 1–2: WhatsApp and other current integrations | **Release 1 design**, to be implemented |
| Section 3–6: Enquiry and admin APIs | **PROPOSED FOR THE FUTURE. NOT PART OF RELEASE 1. DO NOT IMPLEMENT NOW** |

**Release 1 has no application API.** No route handlers, Server Actions or database exist. `sitemap.xml` and `robots.txt` are static metadata routes.

## 1. Current external integrations

| Integration | Direction | Data sent | Trigger | Failure behaviour |
|---|---|---|---|---|
| **WhatsApp click to chat** | Browser to `wa.me` | Pre-filled enquiry text and BAMBOOS's number | Visitor clicks a link | Copy message, or call |
| **Google Maps** | Browser to Google | None until clicked | Link, or click-to-load embed | Address remains as text |
| **YouTube** (if used) | Browser to YouTube | None until clicked | Click-to-load facade, `youtube-nocookie.com` | Poster and external link |
| **Vercel Web Analytics** (if approved) | Browser to same-origin endpoint | Page views, approved custom events | Page load | Site unaffected |
| **Social media** | Outbound link | Nothing beyond navigation | Click | n/a |

## 2. WhatsApp integration

### 2.1 URL contract

From WhatsApp's [official click-to-chat documentation](https://faq.whatsapp.com/5913398998672934):

```text
https://wa.me/<number>?text=<url-encoded text>
```

`<number>` is a full international number, omitting zeroes, brackets, dashes and any `+`.

This is a public link format, not a contracted API. It has no authentication, delivery receipt or service guarantee.

### 2.2 Service interfaces

Pure functions with no React or browser dependency. **Design only.**

```ts
// src/services/whatsapp.ts
export const MAX_WHATSAPP_URL_LENGTH = 4000;

export function buildWhatsAppUrl(number: string, text?: string): string {
  const digits = number.replace(/\D/g, "");
  const base = `https://wa.me/${digits}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
```

```ts
// src/services/enquiry-handoff.ts
export function formatEnquiryMessage(enquiry: Enquiry): string;

export function prepareEnquiryHandoff(
  enquiry: Enquiry,
  whatsappNumber: string | null,
): EnquiryHandoff;
```

The form calls one function and handles one result type. When a backend arrives, this call site is where saving is added.

### 2.3 Message and length rules

**Example of a generated message.** The values are fictional:

```text
Hello BAMBOOS Team!

I would like to enquire about hosting an event at your auditorium.

*EVENT ENQUIRY DETAILS*
Name: Example Name
Phone: +91 00000 00000
Event Type: Wedding
Preferred Date: 14 February 2027
Expected Guests: 500

Additional Message:
We would like details about the main hall.

Please share the availability, packages and further details.

Thank you!
```

**Formatting rules**

- The Additional Message section is omitted when empty, with no blank label.
- Asterisks around the heading are WhatsApp's bold marker. The site's preview shows it in bold.
- The enquiry-not-a-booking notice is on the review step, not in the message.
- Dates are shown unambiguously (`14 February 2027`), never `02/03/27`.
- Text is built as plain text, and encoded exactly once with `encodeURIComponent`.
- Labels are in English. The visitor's text may be in any language.

**Length budget.** A character limit alone doesn't bound the URL, because encoding expands differently by script:

| Script | Encoded size per character | 300-character message |
|---|---|---|
| ASCII letters | 1 | 300 |
| Malayalam | 9 (3 UTF-8 bytes × 3 characters each) | 2,700 |

So the service checks the **encoded URL length** against `MAX_WHATSAPP_URL_LENGTH` and returns `message-too-long` when over.

> The 4,000 figure is a conservative design budget. WhatsApp's documentation does not state a limit. Confirm it through real-device testing with long Malayalam text on Android, iOS and WhatsApp Web, and lower it if needed.

### 2.4 Link attributes

```html
<a href="https://wa.me/..." target="_blank" rel="noopener noreferrer">Send Enquiry via WhatsApp</a>
```

- A real link, activated by the visitor. No automatic redirect and no `window.open` on submit.
- Repeat clicks are ignored for four seconds, then the link works again in case WhatsApp didn't open.
- Accessible name states the destination, and that it opens WhatsApp.
- Branding follows WhatsApp's brand guidelines, using its official assets.

### 2.5 Generic chat links

Header, footer and contact actions use `buildWhatsAppUrl(number, "Hello BAMBOOS, I would like to know more about the venue.")`. These links are generated at build time, so they appear in static HTML and work without JavaScript.

### 2.6 Validation

| Stage | Check |
|---|---|
| Build / launch | `whatsappNumber` set; digits only; plausible length |
| Form | `enquirySchema` |
| Handoff | Number present; encoded length within budget |
| Query string | `?event=` accepted only if it matches a known id; otherwise ignored |

### 2.7 Error handling

| Condition | Result | Visitor sees |
|---|---|---|
| Field invalid | Schema errors | Inline messages and summary |
| Number missing | `whatsapp-not-configured` | Other contact methods |
| Too long | `message-too-long` | Prompt to shorten the message |
| WhatsApp not installed | `wa.me` page offers alternatives | Copy message and call remain on the page |
| Blocked or fails to open | Not detectable | Copy message and call remain on the page |

The review step stays visible after the link is clicked, so a visitor who returns can try again.

### 2.8 Analytics events

Allowed:

| Event | Properties |
|---|---|
| `enquiry_form_started` | None |
| `enquiry_validation_failed` | Count only |
| `enquiry_handoff_clicked` | `eventType` |
| `whatsapp_clicked`, `call_clicked` | `location` (`header`, `footer`, `contact`) |

**Never include** name, phone, message, preferred date or the generated URL. `enquiry_handoff_clicked` measures **intent**: whether the message was sent can't be known.

---

## 3. Proposed future enquiry API

> **PROPOSED, NOT IMPLEMENTED.** Build this only when the trigger in [ARCHITECTURE.md](ARCHITECTURE.md#21-scalability-strategy) occurs.

### Implementation choice

| Option | Use |
|---|---|
| **Server Action** `submitEnquiry` | **Recommended first.** The website is the only client, and the bundled Next.js forms guide recommends this pattern. Also supports progressive enhancement |
| **Route Handler** `POST /api/v1/enquiries` | Add only when a non-web client or external integration needs HTTP |

Either way, Server Actions are publicly reachable endpoints and need the same protections. Both call one server function and return the same result shape. The HTTP form is shown below, because it documents the contract most precisely.

### Updated flow

1. Validate with the shared `enquirySchema` **on the server**.
2. Apply bot and rate-limit checks.
3. Save the enquiry, and return its reference.
4. Notify staff (asynchronously, so a failed email doesn't lose an enquiry).
5. Show confirmation and offer the existing WhatsApp link.

Saving comes before WhatsApp, so the lead survives if the visitor abandons the chat.

### `POST /api/v1/enquiries` — proposed

**Request**

```http
POST /api/v1/enquiries HTTP/1.1
Content-Type: application/json
Idempotency-Key: 6f1c7f0e-2d55-4f7a-9d0e-8b0a2c1f4e11
```

```json
{
  "name": "Example Name",
  "phone": "+91 00000 00000",
  "eventType": "wedding",
  "preferredDate": "2027-02-14",
  "guestCount": 500,
  "message": "We would like details about the main hall.",
  "privacyNoticeVersion": "2027-01",
  "website": "",
  "captchaToken": "<token>"
}
```

`website` is a honeypot that must remain empty. `captchaToken` applies only if bot protection is enabled.

**`201 Created`**

```json
{
  "data": {
    "reference": "ENQ-7K3M9Q",
    "status": "new",
    "createdAt": "2027-01-10T09:30:00Z",
    "whatsappUrl": "https://wa.me/<number>?text=..."
  },
  "notice": "This is an enquiry, not a confirmed booking."
}
```

The response never returns other customers' data, and has no public lookup by reference.

**`422 Unprocessable Content`**

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Please check the highlighted fields.",
    "fields": { "phone": ["Please enter a valid phone number"] }
  }
}
```

### Error model — proposed

| Status | Code | Meaning | Client behaviour |
|---|---|---|---|
| 400 | `MALFORMED_REQUEST` | Body can't be parsed | Generic error, offer WhatsApp and phone |
| 403 | `BOT_CHECK_FAILED` | Failed bot verification | Retry, offer WhatsApp and phone |
| 409 | `DUPLICATE_REQUEST` | Same idempotency key with a different body | Generic error |
| 413 | `PAYLOAD_TOO_LARGE` | Over the body limit | Generic error |
| 422 | `VALIDATION_FAILED` | Field errors | Inline errors |
| 429 | `RATE_LIMITED` | Too many requests. Includes `Retry-After` | Wait, offer WhatsApp and phone |
| 500 | `INTERNAL_ERROR` | Unexpected | **WhatsApp link built client-side still works**, with no stack traces exposed |

The WhatsApp service remains available in the browser, so a backend outage never stops a visitor from reaching BAMBOOS.

## 4. Proposed admin API

> **PROPOSED, NOT IMPLEMENTED.** All operations need an authenticated staff session, with authorisation checked in the data access layer. Implement as Server Actions unless a separate client exists.

| Operation | Method and path | Purpose |
|---|---|---|
| List enquiries | `GET /api/v1/admin/enquiries?status=new&cursor=...` | Paginated list |
| Get enquiry | `GET /api/v1/admin/enquiries/{id}` | Detail and history |
| Update enquiry | `PATCH /api/v1/admin/enquiries/{id}` | Change status, add a note |
| Create booking | `POST /api/v1/admin/bookings` | Create from an enquiry, tentative |
| Confirm booking | `POST /api/v1/admin/bookings/{id}/confirm` | Staff confirmation |
| Cancel booking | `POST /api/v1/admin/bookings/{id}/cancel` | Cancel with reason |

**Example:** `PATCH /api/v1/admin/enquiries/{id}`

```json
{ "status": "contacted", "note": "Called and shared hall details." }
```

```json
{ "data": { "id": "<uuid>", "status": "contacted", "updatedAt": "2027-01-10T11:00:00Z" } }
```

**Example:** confirming a conflicting booking returns `409`:

```json
{ "error": { "code": "BOOKING_CONFLICT", "message": "This hall already has a confirmed booking in that period." } }
```

## 5. Proposed public availability API

> **PROPOSED, NOT IMPLEMENTED.** Requires reliable booking data first.

`GET /api/v1/availability?hallId=<id>&month=2027-02` returns only `available`, `limited` or `unavailable` per date, with no customer or event details. It's cacheable and invalidated on booking change. Availability is informational, and doesn't reserve a date.

## 6. Proposed API conventions

- JSON, UTF-8, ISO 8601 UTC timestamps, and `{ data }` or `{ error }` envelopes.
- URL versioning is applied only to HTTP APIs that have external clients.
- Schemas in `src/schemas` are the single validation source.
- Structured logs with request ids, and **no personal data in logs**.
- Security controls are specified in [SECURITY.md](SECURITY.md#9-future-backend-security).
