# Stage 1: Build the React application
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Serve the application with a simple web server
FROM alpine:latest

WORKDIR /app

# Install 'serve' globally
RUN npm install -g serve

# Copy the build output from the builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
