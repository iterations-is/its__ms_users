FROM node:16-alpine as builder

# Dependencies Image Part
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install

# Application Image Part
COPY . /app
RUN yarn prisma generate
RUN yarn build

FROM node:16-alpine as runner
WORKDIR /app
RUN yarn add prisma

COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env.production ./.env
COPY --from=builder /app/build .
EXPOSE ${MS_EXPRESS_PORT}

CMD yarn prisma migrate deploy && node /app/main.js"
