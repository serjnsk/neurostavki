FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Generate Prisma client and build
RUN npx prisma generate
RUN npm run build

# Expose port (Railway provides PORT env var)
ENV PORT=3000
EXPOSE 3000

# Start command - prisma db push happens at runtime
CMD npx prisma db push --accept-data-loss && npm start

