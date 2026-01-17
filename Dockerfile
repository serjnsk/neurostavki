FROM node:20-alpine

WORKDIR /app

# Copy package files and prisma schema (needed for postinstall)
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (postinstall runs prisma generate)
RUN npm ci

# Copy rest of source
COPY . .

# Build the application
RUN npm run build

# Expose port (Railway provides PORT env var)
ENV PORT=3000
EXPOSE 3000

# Start command - prisma db push happens at runtime
CMD npx prisma db push --accept-data-loss && npm start


