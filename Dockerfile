# Install dependencies only when needed
FROM node:20-alpine AS deps
WORKDIR /usr/src/app
COPY . ./
RUN npm install -g pnpm && \
    pnpm install && \
    npx prisma generate && \
    pnpm build 
    
FROM node:20-alpine AS only-deps
WORKDIR /usr/src/app
COPY . ./
RUN npm install -g pnpm && \
    pnpm install --production && \
    npx prisma generate 

# Production image
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY --from=only-deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/dist/src ./src
COPY --from=deps /usr/src/app/package.json ./package.json
CMD [ "node", "src/main.js" ]