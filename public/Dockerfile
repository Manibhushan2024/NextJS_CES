# --- Base Stage ---
# The video selects a specific, recent version of Node.js on Alpine Linux for a small footprint [1].
FROM node:22.5.1-alpine AS base

# Install necessary shared libraries (libc6-compat) required for Alpine [1].
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files to install dependencies
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
# (Note: The transcript implies an install step here, standard is 'npm ci' or 'npm install')
RUN npm ci

# --- Builder Stage ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable Next.js telemetry during the build [1].
ENV NEXT_TELEMETRY_DISABLED 1

# Build the Next.js application [1].
RUN npm run build

# --- Runner Stage (Production) ---
FROM base AS runner
WORKDIR /app

# Set environment to production
ENV NODE_ENV production

# Disable telemetry during runtime
ENV NEXT_TELEMETRY_DISABLED 1

# Create a system group and user for security (non-root execution) [2].
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the public folder and static assets
# (The transcript mentions copying build directories and setting ownership) [2].
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to the non-root user [2].
USER nextjs

# Expose the port the app runs on [2].
EXPOSE 3000

# Set the PORT environment variable [2].
ENV PORT 3000

# Start the application [2].
CMD ["node", "server.js"]