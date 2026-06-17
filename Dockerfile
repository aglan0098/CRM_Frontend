# ---------- Build Stage ----------
FROM node:22-alpine AS builder 

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./   

# Install dependencies
RUN npm ci                             

# Copy all other source code
COPY . .                              

# Build the React app for production
RUN npm run build  

# ---------- Production Stage ----------
FROM nginx:alpine3.22 AS production

RUN apk update && apk upgrade --no-cache

# Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*   

# Copy built files from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom nginx config if needed
COPY nginx.conf /etc/nginx/conf.d/default.conf 

# Expose port
EXPOSE 8080   

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 

