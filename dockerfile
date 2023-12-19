
# Stage 1: Build the Angular app
FROM node:latest as node
 
WORKDIR /app
 
COPY package*.json ./
 
 
RUN npm install
 
 
COPY . .
 
 
RUN npm run build --prod
 
# Stage 2: Create a lightweight image with just the Angular app
FROM nginx:alpine
 
 
COPY --from=node /app/dist/sequelizedemo /usr/share/nginx/html
 
 
 