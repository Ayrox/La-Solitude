FROM node:20-slim AS builder

# Installation des dépendances système pour le build
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer TOUTES les dépendances (production + dev) avec compilation native
RUN npm ci --include=dev

# Copier le code source
COPY src/ ./src/

# Nettoyer les dépendances de développement mais garder les binaires compilés
RUN npm prune --omit=dev

# Stage de production
FROM node:20-slim AS production

# Installation des dépendances système nécessaires pour canvas (runtime seulement)
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
    ffmpeg \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY --from=builder /app/package*.json ./

# Copier les node_modules entièrement compilés depuis le builder
COPY --from=builder --chown=1000:1000 /app/node_modules/ ./node_modules/

# Copier le code source depuis le stage builder
COPY --from=builder --chown=1000:1000 /app/src/ ./src/

# Changer vers l'utilisateur non-root
USER 1000:1000

# Démarrer l'application
CMD ["node", "./src/index.js"]
