import mongoose from "mongoose"
import db from "../../Models/infraction.js"
import { ActivityType } from "discord.js";
const database = process.env.DATABASE
import { loadCommands } from "../../Handlers/Commands.js";

export const event = {
    name: 'ready',
    once: true,

    async execute(client) {
        await loadCommands(client);
        var memberCount = client.users.cache.size;
        var guildCount = client.guilds.cache.size;
        
        console.log("--------------------------------------\n");
        console.log(`${client.user.username} est prêt !\n`);
        console.log(`[!] Nombre de serveurs: ${guildCount}`)
        console.log(`[!] Nombre total de membres: ${memberCount}`);
        console.log(`[!] Nombre de commandes initialisées: ${client.commands.size}`);
        console.log("\n--------------------------------------");

        // Fonction pour mettre à jour le rich presence avec la musique
        client.updateMusicActivity = function(queue, song) {
            console.log('[RICH_PRESENCE] updateMusicActivity appelée');
            console.log('[RICH_PRESENCE] Queue reçu:', queue ? 'OUI' : 'NON');
            console.log('[RICH_PRESENCE] Song reçu:', song ? 'OUI' : 'NON');
            
            if (!queue || !song) {
                // Remettre le statut par défaut
                client.user.setActivity(`${client.guilds.cache.size} serveurs | ${client.users.cache.size} utilisateurs`, {
                    type: ActivityType.Watching,
                });
                console.log('[RICH_PRESENCE] Statut par défaut restauré (queue/song manquant)');
                return;
            }

            try {
                console.log('[RICH_PRESENCE] Données queue:', { currentTime: queue.currentTime, formattedCurrentTime: queue.formattedCurrentTime });
                console.log('[RICH_PRESENCE] Données song:', { name: song.name, duration: song.duration, formattedDuration: song.formattedDuration });
                
                // Calculer la progression (0-10)
                const progress = Math.min(Math.floor((queue.currentTime / song.duration) * 10), 10);
                const progressBar = '█'.repeat(progress) + '░'.repeat(10 - progress);
                
                // Tronquer le nom si trop long (35 caractères pour laisser de la place)
                const songName = song.name.length > 35 ? song.name.substring(0, 32) + '...' : song.name;
                
                // Format: "🎵 Song Name ████░░░░░░ 2:35/4:12"
                const activityText = `🎵 ${songName} ${progressBar} ${queue.formattedCurrentTime}/${song.formattedDuration}`;

                console.log(`[RICH_PRESENCE] Activité générée: ${activityText}`);
                console.log(`[RICH_PRESENCE] Tentative de setActivity...`);

                client.user.setActivity(activityText, {
                    type: ActivityType.Playing,
                });

                console.log(`[RICH_PRESENCE] setActivity réussie!`);
            } catch (error) {
                console.error('[RICH_PRESENCE] Erreur:', error.message);
                console.error('[RICH_PRESENCE] Stack:', error.stack);
                // En cas d'erreur, revenir au statut par défaut
                client.user.setActivity(`${client.guilds.cache.size} serveurs | ${client.users.cache.size} utilisateurs`, {
                    type: ActivityType.Watching,
                });
            }
        };

        // Fonction pour remettre le statut par défaut
        client.setDefaultActivity = function() {
            try {
                client.user.setActivity(`${client.guilds.cache.size} serveurs | ${client.users.cache.size} utilisateurs`, {
                    type: ActivityType.Watching,
                });
                console.log('[RICH_PRESENCE] Statut par défaut défini');
            } catch (error) {
                console.error('[RICH_PRESENCE] Erreur lors de la définition du statut par défaut:', error.message);
            }
        };

        // Définir le statut par défaut au démarrage
        client.setDefaultActivity();

        if (!database) return console.log("MongoDB's link is not set");

        try {
            await mongoose.connect(database, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log("\nThe client is now connected to the database !\n");

            const data = await db.find({ MuteData: { $exists: true } }).exec();
            if (data.length === 0) {
                console.log("No data found");
            } else {
                for (const infraction of data) {
                    const { Duration, Date: MuteDate } = infraction.MuteData;
                    const Now = new Date();
                    // ... logique ici ...
                }
            }
        } catch (err) {
            console.error(err);
        }
        return;
    }
}