# Bước 1: Build React Vite SPA
FROM node:20-alpine AS build
WORKDIR /app

# Cache package dependencies
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit

# Copy source code và build
COPY . .
RUN npm run build

# Bước 2: Nginx phục vụ static file và Reverse Proxy sang backend
FROM nginx:alpine AS runtime

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

