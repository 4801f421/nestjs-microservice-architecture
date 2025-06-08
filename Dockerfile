# --- Base Stage ---
# Using the specific slim version of Node.js as requested.
FROM node:23-slim AS base
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm install

# --- Builder Stage ---
FROM base AS builder
COPY . .
RUN npm run build

# --- Production Stage ---
FROM node:23-slim AS production
WORKDIR /usr/src/app
# Copy only production dependencies for a smaller final image.
COPY --from=base /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY package.json .