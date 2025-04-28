# Step 1: Build the app
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Step 2: Serve the built app
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Remove the default nginx config and use a custom one if needed
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
