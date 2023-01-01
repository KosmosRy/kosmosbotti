FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock* .yarnrc.yml .swcrc ./
COPY .yarn ./.yarn
RUN yarn --immutable;

COPY src ./src
RUN yarn build

FROM node:18-alpine AS runtime-deps

WORKDIR /app
COPY --from=builder /app/package.json /app/yarn.lock /app/.yarnrc.yml ./
COPY --from=builder /app/.yarn ./.yarn
RUN yarn workspaces focus --production

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=runtime-deps /app/package.json /app/yarn.lock ./
COPY --from=runtime-deps /app/node_modules ./node_modules
COPY --from=builder /app/build ./build

CMD ["node", "build/index.js"]
