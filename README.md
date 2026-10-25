# Castle Elevator

Marketing website and enquiry intake for Castle Elevator, built with Next.js and TypeScript. The operating business serves Delhi, Gurugram and Noida with an owner-reported team of 20–30 people.

The source does **not yet implement** an authenticated admin, durable CRM, quotations, job dispatch, invoices, payments or AMC renewals. Installed MongoDB packages do not mean those features exist. Historical PHASE and DEPLOYMENT documents contain outdated completion claims; use this README, the current source and the verification record instead.

## Business and implementation plan

Read [Castle Elevator India growth plan](reports/Castle%20Elevator%20India%20growth%20plan.md) for the market research, competitor/customer analysis, quotation-to-collection workflow, system requirements, advertising scenarios, investment model and staged India expansion.

The confirmed acquisition goal is 50–60 valid installation/service enquiries each day. The plan distinguishes a measurement pilot from the much larger budget and delivery capacity that goal could require.

## Local development

Use Node.js 22 or 24 and npm.

- Install: npm ci
- Start development: npm run dev
- Type check: npm run type-check
- Lint: npm run lint
- Verify intake with a mocked email provider: npm run test:intake
- Build: npm run build
- Run production build: npm start

For the HTTP smoke check, run the production server on port 3109, then run node scripts/verify-production.cjs. It sends no email.

## Email configuration

Copy .env.example to .env.local and configure RESEND_API_KEY, EMAIL_FROM and ADMIN_EMAIL. The sender must belong to a domain verified in Resend. SMTP_FROM remains a compatibility fallback for the sender address; the active transport is Resend, not SMTP.

Both /api/contact and /api/enquiry use the same validated handler. Requests require contact consent. The handler emails the enquiry and optional audio attachment to the admin; only provider acceptance of that email permits a success response. Failure of the separate customer acknowledgement is reported without asking the customer to resubmit an already accepted enquiry.

This is email-backed intake, not durable CRM storage. Inbox delivery, bounce monitoring, persistence, retry queues, first-touch attribution across navigation and distributed anti-abuse controls still need implementation. UTM/gclid capture currently reads the contact page URL.

## Security and deployment

Known exposed credential text was redacted from documentation. Rotate the exposed credential and review Git history and published copies; local redaction does not revoke it.

Never commit environment credentials. The Docker and cloud upload contexts exclude environment files and duplicate deployment exports. The Node 22 Docker image includes JSON files required by the runtime content loaders. Docker image execution and cloud deployment require separate validation.

The old unauthenticated /api/operations logger is retired and returns HTTP 410. It must be replaced by authenticated, role-checked, durable business operations.

The rate limiter is bounded and per process. Configure a trusted proxy that overwrites client IP headers and shared rate limiting before scaling to multiple instances.

Review current framework/dependency advisories, public coverage/warranty/response claims and the older CI workflow runtime settings before production rollout. Do not use archived deployment trees as the current source.

See [local verification](reports/System%20verification%202026-10-25.md) for the exact checks and remaining launch requirements.
