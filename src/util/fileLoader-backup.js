import { glob } from "glob";
import { createRequire } from 'module';
import { readdir } from 'fs/promises';
import { join } from 'path';

const require = createRequire(import.meta.url);

// Version alternative utilisant readdir récursif
export async function loadFilesRecursive(dirName) {
    const files = [];
    const basePath = join(process.cwd(), 'src', dirName);
    
    console.log(`[FILELOADER_ALT] Recherche récursive dans: ${basePath}`);
    
    async function scanDir(dirPath, baseDir = '') {
        try {
            const entries = await readdir(dirPath, { withFileTypes: true });
            
            for (const entry of entries) {
                const fullPath = join(dirPath, entry.name);
                const relativePath = join(baseDir, entry.name);
                
                if (entry.isDirectory()) {
                    await scanDir(fullPath, relativePath);
                } else if (entry.isFile() && entry.name.endsWith('.js')) {
                    files.push(fullPath);
                    console.log(`[FILELOADER_ALT] Fichier trouvé: ${relativePath}`);
                }
            }
        } catch (error) {
            console.error(`[FILELOADER_ALT] Erreur lors du scan de ${dirPath}:`, error.message);
        }
    }
    
    await scanDir(basePath);
    console.log(`[FILELOADER_ALT] Total de fichiers trouvés: ${files.length}`);
    return files;
}

// Version originale améliorée
export async function loadFiles(dirName) {
    const basePath = process.cwd();
    const pattern = `${basePath}/src/${dirName}/**/*.js`.replace(/\\/g, "/");
    
    console.log(`[FILELOADER] Recherche des fichiers avec le pattern: ${pattern}`);
    console.log(`[FILELOADER] Répertoire de travail: ${basePath}`);
    
    try {
        // Essayer d'abord avec glob
        let Files = await glob(pattern);
        console.log(`[FILELOADER] Fichiers trouvés avec glob: ${Files.length}`);
        
        // Si glob ne trouve rien, essayer la méthode récursive
        if (Files.length === 0) {
            console.log(`[FILELOADER] Tentative avec méthode récursive...`);
            Files = await loadFilesRecursive(dirName);
        }
        
        Files.forEach((file, index) => {
            console.log(`[FILELOADER] [${index + 1}] ${file}`);
            try {
                delete require.cache[require.resolve(file)];
            } catch (error) {
                console.log(`[FILELOADER] Impossible de nettoyer le cache pour: ${file}`);
            }
        });
        
        return Files;
    } catch (error) {
        console.error(`[FILELOADER] Erreur lors du chargement des fichiers:`, error);
        
        // Dernier recours: essayer la méthode récursive
        try {
            console.log(`[FILELOADER] Tentative de récupération avec méthode récursive...`);
            return await loadFilesRecursive(dirName);
        } catch (fallbackError) {
            console.error(`[FILELOADER] Échec de la méthode de récupération:`, fallbackError);
            return [];
        }
    }
}
