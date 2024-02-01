FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY . .

RUN yarn workspaces focus --all --production

# Rebuild the source code only when needed
FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=deps /app/. .

ARG NEXT_PUBLIC_ENV
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_SERVER_URL
ARG NEXT_PUBLIC_APP_CONTAINER_URL
ARG PILOTAGE_GIT_REVISION
ARG NEXT_PUBLIC_CRISP_TOKEN
ARG NEXT_PUBLIC_SENTRY_DSN

# Map arguments to react-scripts env variables
ENV NEXT_PUBLIC_ENV=$NEXT_PUBLIC_ENV
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
ENV NEXT_PUBLIC_APP_CONTAINER_URL=$NEXT_PUBLIC_APP_CONTAINER_URL
ENV NEXT_PUBLIC_CRISP_TOKEN=$NEXT_PUBLIC_CRISP_TOKEN
ENV NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN

# Git revision for slack logs
ENV PILOTAGE_GIT_REVISION=$PILOTAGE_GIT_REVISION

ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn workspaces foreach -p run build

# Production image, copy all the files and run next
FROM node:18-alpine AS runner
RUN apk add --no-cache parallel
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/. .

EXPOSE 5000
EXPOSE 3000
CMD parallel --ungroup --halt-on-error 2 ::: "yarn workspace server start" "yarn workspace ui start"
