# CastleElevator Copilot Instructions

## Project Overview
CastleElevator is a full-stack Next.js 16 website for an elevator service company. It features 11 dynamic pages, dark/light theme support, contact forms with voice recording, and JSON-based content management. The stack includes TypeScript, React 19, Tailwind CSS, MongoDB (via Mongoose), and email/SMS services.

## Architecture & Key Components

### Content Layer (Data Flow)
- **Single Source of Truth**: All dynamic content (products, services, projects, testimonials, service areas) lives in `src/lib/*.json` files
- **Content Loading**: `src/lib/content.ts` exports typed loader functions (`getProducts()`, `getServices()`, etc.) that read JSON at build/runtime
- **Pattern**: All `[slug]` pages use these functions + URL params to dynamically render detail pages
- **Key Types**: Product, Service, Project, Testimonial, ServiceArea (defined in `src/lib/content.ts`)

### Theme System
- **Client-Side Context**: `src/components/ThemeProvider.tsx` manages dark/light mode with React Context
- **Persistence**: Theme stored in localStorage, persists across sessions
- **CSS Class**: Dark mode applied via `dark` class on `<html>` element (Tailwind CSS dark mode)
- **Initial Logic**: Respects system preference if no localStorage value exists

### API & Validation
- **Form Submission**: POST `/api/enquiry` handles contact/enquiry forms via Zod validation (`src/lib/validation.ts`)
- **Email Service**: `src/lib/email-service.ts` sends notifications via Resend/Nodemailer
- **Rate Limiting**: Client IP-based rate limit implemented in `src/lib/rate-limit.ts`
- **Voice Files**: Multipart form-data support for voice recordings (60sec max, ~500KB limit per `VoiceFileSchema`)
- **Enquiry ID**: Generated as `ENQ-{timestamp}-{random}` for tracking

### Layout & Navigation
- **Root Layout**: `src/app/layout.tsx` contains global metadata, imports ThemeProvider, Header, Footer, MobileStickyBar
- **Header**: Sticky navigation with contact bar (phone: +91 8285266082, hardcoded)
- **Mobile UX**: MobileStickyBar provides call/enquiry buttons on mobile only
- **Hero**: HeroCarousel component on home page rotates banner images

## File Organization Patterns

### Dynamic Page Routes
```
src/app/{products,services}/page.tsx           # Hub pages (list all items)
src/app/{products,services}/[slug]/page.tsx    # Detail pages (FAQ + data from JSON)
```
- Load data: `const item = get{Product|Service}BySlug(params.slug)`
- All detail pages include FAQ sections sourced from JSON

### Component Structure
- **UI Components**: `src/components/ui/` contains Button, Card, Input, TextArea, Alert, Badge, Select
- **Page Components**: Header, Footer, ThemeProvider, VoiceRecorder, HeroCarousel at `src/components/`
- **Naming**: PascalCase, exported as defaults or named exports

## Development Workflow

### Build & Test Commands
```bash
npm run dev           # Start dev server (http://localhost:3000)
npm run build         # Production build
npm run lint          # Run ESLint
npm run lint:fix      # Auto-fix ESLint issues
npm run format        # Format code with Prettier
npm run type-check    # TypeScript type validation
```

### Code Quality Standards
- **TypeScript**: Strict mode enabled, full type safety required
- **ESLint**: Uses Next.js + TypeScript config (`eslint-config-next`)
- **Formatting**: Prettier enforced (check with `npm run format:check`)
- **React Compiler**: Enabled in `next.config.ts` for auto-memoization

## Key Patterns & Conventions

### Enum-Based Validation
Service types (installation, maintenance, repair, modernization, consultation, emergency) and product types are enums in `EnquirySchema` — update these in both `validation.ts` AND relevant forms to keep in sync.

### Image Paths
All images use Next.js `<Image>` component with `/images/{category}/{filename}` paths. Image directories exist but are empty — populate before deployment.

### Dark Mode Classes
Use Tailwind's dark: prefix: `className="text-gray-900 dark:text-white"`. The ThemeProvider handles the html.dark class toggle.

### JSON Schema Extensibility
When adding new fields to products/services/projects:
1. Update the JSON file (`src/lib/*.json`)
2. Update the TypeScript interface in `content.ts`
3. Update consumer components to display the field
4. No build step needed — JSON is loaded at runtime

### Email & SMS Integration
- Resend and Nodemailer configured in `email-service.ts`
- Voice files attached to emails when provided
- Admin notifications sent to hardcoded email on form submission

## Important Constraints & Gotchas

1. **Hardcoded Contact Info**: Phone and email are hardcoded in components (search for "+91 8285266082"). Update via find-replace across all files when changing.
2. **Build Considerations**: `next.config.ts` has `reactCompiler: true` — may affect debugging. Disable if issues arise.
3. **JSON Loading**: Uses `fs.readFileSync()` at runtime — only works on server-side pages. Don't import JSON in client components.
4. **Rate Limiting Memory**: In-memory rate limit in `rate-limit.ts` — doesn't persist across server restarts. Use Redis for production.
5. **Voice Recorder 60s Limit**: Hardcoded in VoiceRecorder component — change `maxDuration` to adjust.
6. **Metadata**: Root layout metadata is extensive — keep in sync with branding changes.

## Image Migration Note
See `IMAGE_MIGRATION.md` for detailed instructions on populating `/public/images/` directories before launch. Currently all image paths reference empty directories.

## Testing & Validation
- No automated tests configured — consider adding Jest/Vitest for unit tests
- Manual smoke test: verify all 11 pages load, theme toggle works, form submissions succeed
- Rate limit test: rapid form submissions should fail after limit
