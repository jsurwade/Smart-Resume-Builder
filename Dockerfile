# Stage 1: Build the app
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install --production=false
COPY . .
RUN npm run build

# Stage 2: Serve production build
FROM alpine:3.18

WORKDIR /app

# Install minimal dependencies
RUN apk add --no-cache nodejs current npm

# Copy build output from builder stage
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm install --production

EXPOSE 3000
CMD ["npm", "start"]
