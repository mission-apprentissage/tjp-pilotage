FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY . .

RUN yarn

# Rebuild the source code only when needed
FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=deps /app/. .

ARG NEXT_PUBLIC_ENV
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_BASE_HOST
ARG NEXT_PUBLIC_METABASE_URL
ARG NEXT_PUBLIC_METABASE_SECRET_KEY
ARG NEXT_PUBLIC_SERVER_URL
# Map arguments to react-scripts env variables
ENV NEXT_PUBLIC_ENV=$NEXT_PUBLIC_ENV
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_BASE_HOST=$NEXT_PUBLIC_BASE_HOST
ENV NEXT_PUBLIC_METABASE_URL=$NEXT_PUBLIC_METABASE_URL
ENV NEXT_PUBLIC_METABASE_SECRET_KEY=$NEXT_PUBLIC_METABASE_SECRET_KEY
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL

ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn workspaces foreach -p run build

# Production image, copy all the files and run next
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/. .

EXPOSE 5000
EXPOSE 3000
CMD yarn workspace server start & yarn workspace ui start