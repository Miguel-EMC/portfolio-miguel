# Etapa 1: Build
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npx ng build community --configuration production

# Etapa 2: Serve
FROM nginx:alpine
# Copiar configuración personalizada de nginx
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 8080;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|svgz|ogg|ogv|webm|htc)$ {
        expires 1y;
        access_log off;
        add_header Cache-Control "public";
    }
}
EOF

COPY --from=build /app/dist/community/browser /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
