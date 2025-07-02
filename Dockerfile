FROM node:20-slim AS builder

# Installation des dépendances système pour le build
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer toutes les dépendances (dev + production)
RUN npm ci

# Copier le code source
COPY src/ ./src/

# Stage de production
FROM node:20-slim AS production

# Installation des dépendances système nécessaires pour canvas
RUN apt-get update && apt-get install -y \
    libcairo2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libgdk-pixbuf-2.0-0 \
    libjpeg62-turbo \
    libgif7 \
    librsvg2-2 \
    libfontconfig1 \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer uniquement les dépendances de production
RUN npm ci --only=production && npm cache clean --force

# Copier le code source depuis le stage builder
COPY --from=builder /app/src/ ./src/

# Créer un utilisateur non-root si nécessaire et définir les permissions
RUN chown -R 1000:1000 /app

# Changer vers l'utilisateur non-root
USER 1000:1000

# Démarrer l'application
CMD ["node", "./src/index.js"]
