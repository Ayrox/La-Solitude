FROM node:20-slim

# Installation des dépendances système nécessaires pour canvas et puppeteer
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    libfontconfig1-dev \
    chromium \
    ca-certificates \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

# Configuration de Puppeteer pour utiliser Chromium installé
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# L'utilisateur node existe déjà dans l'image node:20-slim
# Pas besoin de le créer

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances en mode production
RUN npm ci --only=production && npm cache clean --force

# Copie du code source
COPY . .

# Changement de propriétaire des fichiers
RUN chown -R node:node /app

# Passage à l'utilisateur non-root
USER node

# Note: Pas d'EXPOSE car c'est un bot Discord, pas un serveur web

CMD [ "node", "./src/index.js" ]