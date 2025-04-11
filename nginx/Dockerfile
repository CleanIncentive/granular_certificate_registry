FROM nginx:latest

# Create SSL directory
RUN mkdir -p /etc/nginx/ssl

# Copy SSL certificates
COPY ssl/fullchain2.pem /etc/nginx/ssl/fullchain2.pem
COPY ssl/privkey2.pem /etc/nginx/ssl/privkey2.pem

# Copy nginx configuration
COPY conf.d/app.conf /etc/nginx/conf.d/app.conf

# Set permissions
RUN chmod 644 /etc/nginx/ssl/fullchain2.pem \
    && chmod 600 /etc/nginx/ssl/privkey2.pem

# Run nginx as root to access the certificates
USER root 