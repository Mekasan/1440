# Use the official nginx image as the base image
FROM nginx:latest

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/

# Copy the Angular app files into the Nginx document root
COPY /dist/1440 /usr/share/nginx/html/

# Expose port 80 for Nginx
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
