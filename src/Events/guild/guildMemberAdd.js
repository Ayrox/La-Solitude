import { createCanvas, loadImage, registerFont } from 'canvas';
import { join } from 'node:path';
import { AttachmentBuilder, EmbedBuilder } from 'discord.js';
import config from '../../config.js';
import { createRequire } from 'module';

// Importer fontkit pour lire les métadonnées de la police
const require = createRequire(import.meta.url);
const fontkit = require('fontkit');

// Détecter et enregistrer la police personnalisée
let customFontFamily = 'Arial'; // Fallback par défaut
let isCustomFontLoaded = false;
try {
    const fontPath = join(process.cwd(), 'src', 'util', 'font', 'fv_almelo-webfont.ttf');
    console.log(`[FONT] Tentative de chargement: ${fontPath}`);
    
    // Lire les métadonnées de la police
    const font = fontkit.openSync(fontPath);
    const realFontName = font.familyName;
    console.log(`[FONT] Nom réel de la police: "${realFontName}"`);
    
    // Enregistrer la police
    registerFont(fontPath, { family: realFontName });
    customFontFamily = realFontName;
    isCustomFontLoaded = true;
    console.log(`[FONT] Police enregistrée avec succès`);
} catch (error) {
    console.error('[FONT] Erreur lors du chargement de la police:', error.message);
    console.log('[FONT] Utilisation de la police par défaut');
}

async function createWelcomeImage(member) {
    try {
        // Créer le canvas
        const canvas = createCanvas(700, 300);
        const ctx = canvas.getContext('2d');

        // Charger et dessiner l'arrière-plan
        const backgroundPath = join(process.cwd(), 'src', 'Util', 'img', 'wallpaper.jpg');
        const background = await loadImage(backgroundPath);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        // Bordure violette
        ctx.strokeStyle = '#74037b';
        ctx.lineWidth = 3;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        // Texte "BIENVENUE"
        ctx.fillStyle = '#ffffff';
        
        // Utiliser la police personnalisée (sans fallback pour éviter les avertissements Pango)
        const fontName = isCustomFontLoaded ? `"${customFontFamily}"` : 'Arial';
        ctx.font = `80px ${fontName}`;
        ctx.textAlign = 'center';
        console.log(`[FONT] Utilisation de la police: ${ctx.font}`);
        
        // Vérifier que la police personnalisée fonctionne
        const testMetrics = ctx.measureText('BIENVENUE');
        console.log(`[FONT] Largeur du texte: ${testMetrics.width}px (font: ${fontName})`);
        
        // Simuler le gras en dessinant le texte plusieurs fois avec des décalages plus prononcés
        const text1 = 'BIENVENUE';
        const x1 = canvas.width / 2;
        const y1 = canvas.height / 1.3;
        
        // Dessiner le texte avec des décalages plus visibles pour l'effet de gras
        for (let dx = -1; dx <= 1; dx += 0.5) {
            for (let dy = -1; dy <= 1; dy += 0.5) {
                if (dx !== 0 || dy !== 0) {
                    ctx.fillText(text1, x1 + dx, y1 + dy);
                }
            }
        }
        // Dessiner le texte principal par-dessus
        ctx.fillText(text1, x1, y1);

        // Nom du membre
        ctx.font = `54px ${fontName}`;
        const text2 = member.displayName;
        const x2 = canvas.width / 2;
        const y2 = canvas.height / 1.05;
        
        // Dessiner le nom avec le même effet de gras
        for (let dx = -0.8; dx <= 0.8; dx += 0.4) {
            for (let dy = -0.8; dy <= 0.8; dy += 0.4) {
                if (dx !== 0 || dy !== 0) {
                    ctx.fillText(text2, x2 + dx, y2 + dy);
                }
            }
        }
        // Dessiner le texte principal par-dessus
        ctx.fillText(text2, x2, y2);

        // Cercle pour l'avatar (fond blanc)
        ctx.save();
        ctx.beginPath();
        ctx.arc(canvas.width / 2, 85, 70, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.clip();

        // Avatar du membre
        const avatarURL = member.user.displayAvatarURL({ extension: 'png', size: 256 });
        const avatar = await loadImage(avatarURL);
        
        // Dessiner l'avatar dans le cercle
        ctx.beginPath();
        ctx.arc(canvas.width / 2, 85, 65, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(avatar, canvas.width / 2 - 65, 20, 130, 130);
        
        ctx.restore();

        // Retourner le buffer de l'image
        return canvas.toBuffer('image/png');

    } catch (error) {
        console.error('[WELCOME IMAGE] Erreur lors de la création de l\'image:', error);
        return null;
    }
}

export const event = {
    name: 'guildMemberAdd',
    once: false,

    async execute(member) {
        console.log(`[${new Date().toISOString()}] [EVENT] [GUILD_MEMBER_ADD] [INFO] A new member joined:`, member.user.tag);

        try {
            // Créer l'image de bienvenue
            const imageBuffer = await createWelcomeImage(member);
            
            if (!imageBuffer) {
                console.error('[GUILD_MEMBER_ADD] Impossible de créer l\'image de bienvenue');
                return;
            }

            // Créer l'attachment
            const welcomeImage = new AttachmentBuilder(imageBuffer, { name: 'welcome-image.png' });

            // Créer l'embed
            const welcomeEmbed = new EmbedBuilder()
                .setTitle('BIENVENUE')
                .setColor(0x00ff00)
                .setDescription(`Bonjour ${member} et bienvenue sur le serveur **${member.guild.name}**. Nous sommes maintenant **${member.guild.memberCount}** sur ce serveur.`)
                .setImage('attachment://welcome-image.png');

            // Envoyer dans le canal de bienvenue
            const guildConf = await config(member.guild.id);
            const welcomeChannelId = guildConf.channel.bienvenueID;
            
            if (!welcomeChannelId) {
                console.log("[GUILD_MEMBER_ADD] Le channel 'bienvenue' n'est pas configuré");
                return;
            }

            const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);
            if (!welcomeChannel) {
                console.log("[GUILD_MEMBER_ADD] Le channel de bienvenue n'existe pas");
                return;
            }

            await welcomeChannel.send({ embeds: [welcomeEmbed], files: [welcomeImage] });

            // Ajouter le rôle "Les Louveteaux" si il existe
            const defaultRole = member.guild.roles.cache.find(role => role.name === "Les Louveteaux");
            if (defaultRole) {
                await member.roles.add(defaultRole);
                console.log(`[GUILD_MEMBER_ADD] Rôle "Les Louveteaux" ajouté à ${member.user.tag}`);
            }

        } catch (error) {
            console.error('[GUILD_MEMBER_ADD] Erreur:', error);
        }
    }
};
