#!/bin/bash

echo "=== DIAGNOSTIC DU CONTENEUR ==="
echo "Répertoire de travail: $(pwd)"
echo "Utilisateur: $(whoami)"
echo "UID/GID: $(id)"

echo -e "\n=== STRUCTURE DES DOSSIERS ==="
ls -la /app/
echo -e "\n=== CONTENU DU DOSSIER SRC ==="
ls -la /app/src/
echo -e "\n=== CONTENU DU DOSSIER COMMANDS ==="
ls -la /app/src/commands/
echo -e "\n=== SOUS-DOSSIERS DE COMMANDS ==="
find /app/src/commands/ -type d
echo -e "\n=== FICHIERS .JS DANS COMMANDS ==="
find /app/src/commands/ -name "*.js" | head -10

echo -e "\n=== PERMISSIONS ==="
ls -la /app/src/commands/ | head -5

echo -e "\n=== TEST GLOB ==="
node -e "
import { glob } from 'glob';
const pattern = '/app/src/commands/**/*.js';
console.log('Pattern:', pattern);
try {
  const files = await glob(pattern);
  console.log('Fichiers trouvés:', files.length);
  files.slice(0, 5).forEach(f => console.log('  -', f));
} catch(e) {
  console.error('Erreur:', e.message);
}
"

echo -e "\n=== TEST NODE_MODULES ==="
ls -la /app/node_modules/ | grep -E "^d.*glob|^d.*discord" | head -5
