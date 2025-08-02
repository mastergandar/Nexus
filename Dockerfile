# Stage 1: Install Dependencies (including dev for build)
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
# Install all dependencies, including dev
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline --ignore-scripts

# Stage 2: Build the Application
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Final Image
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]