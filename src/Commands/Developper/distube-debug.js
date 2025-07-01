import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export const command = {
    data: new SlashCommandBuilder()
        .setName('distube-debug')
        .setDescription('🔧 [DEBUG] Affiche des informations détaillées sur l\'état de DisTube'),

    /**
     * @param {import("discord.js").ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        try {
            const { client } = interaction;
            const guildId = interaction.guildId;

            await interaction.deferReply({ ephemeral: true });

            console.log(`[${new Date().toISOString()}] [COMMAND] [DISTUBE_DEBUG] [INFO] Debug requested by ${interaction.user.tag}`);

            // Informations sur DisTube
            const distubeInfo = {
                version: client.distube.constructor.version || "Version inconnue",
                options: client.distube.options,
                plugins: client.distube.options.plugins?.map(p => p.constructor.name) || []
            };

            // Informations sur la queue actuelle
            const queue = client.distube.getQueue(guildId);
            let queueInfo = null;
            
            if (queue) {
                queueInfo = {
                    exists: true,
                    autoplay: queue.autoplay,
                    volume: queue.volume,
                    paused: queue.paused,
                    playing: queue.playing,
                    repeatMode: queue.repeatMode,
                    songsCount: queue.songs.length,
                    previousSongsCount: queue.previousSongs?.length || 0,
                    filters: queue.filters.names,
                    voiceChannel: queue.voiceChannel?.name,
                    textChannel: queue.textChannel?.name,
                    currentSong: queue.songs[0] ? {
                        name: queue.songs[0].name,
                        duration: queue.songs[0].formattedDuration,
                        uploader: queue.songs[0].uploader?.name,
                        url: queue.songs[0].url
                    } : null,
                    lastPlayerMessage: !!queue.lastPlayerMessage,
                    progressInterval: !!queue.progressUpdateInterval
                };
            } else {
                queueInfo = { exists: false };
            }

            // Vérifier les événements DisTube chargés
            const distubeEvents = [];
            for (const [eventName, eventData] of client.events) {
                if (eventName.startsWith('distube')) {
                    distubeEvents.push(eventName);
                }
            }

            // Créer l'embed de debug
            const debugEmbed = new EmbedBuilder()
                .setColor(0x00ff00)
                .setTitle("🔧 DisTube Debug - État détaillé")
                .setDescription("Informations complètes sur l'état de DisTube")
                .addFields([
                    {
                        name: "📦 DisTube Core",
                        value: `**Version:** ${distubeInfo.version}\n` +
                               `**Plugins:** ${distubeInfo.plugins.join(', ') || 'Aucun'}\n` +
                               `**emitNewSongOnly:** ${distubeInfo.options.emitNewSongOnly}\n` +
                               `**savePreviousSongs:** ${distubeInfo.options.savePreviousSongs}\n` +
                               `**nsfw:** ${distubeInfo.options.nsfw}`,
                        inline: false
                    },
                    {
                        name: "🎵 Queue Status",
                        value: queueInfo.exists ? 
                            `**Existe:** ✅ Oui\n` +
                            `**Autoplay:** ${queueInfo.autoplay ? '✅ Activé' : '❌ Désactivé'}\n` +
                            `**État:** ${queueInfo.playing ? '▶️ En lecture' : queueInfo.paused ? '⏸️ En pause' : '⏹️ Arrêté'}\n` +
                            `**Volume:** ${queueInfo.volume}%\n` +
                            `**Mode répétition:** ${queueInfo.repeatMode}\n` +
                            `**Musiques en file:** ${queueInfo.songsCount}\n` +
                            `**Musiques précédentes:** ${queueInfo.previousSongsCount}` :
                            `**Existe:** ❌ Aucune queue active`,
                        inline: false
                    }
                ]);

            if (queueInfo.exists && queueInfo.currentSong) {
                debugEmbed.addFields([
                    {
                        name: "🎶 Musique actuelle",
                        value: `**Titre:** ${queueInfo.currentSong.name}\n` +
                               `**Durée:** ${queueInfo.currentSong.duration}\n` +
                               `**Créateur:** ${queueInfo.currentSong.uploader || 'Inconnu'}\n` +
                               `**URL:** [Lien](${queueInfo.currentSong.url})`,
                        inline: false
                    }
                ]);
            }

            if (queueInfo.exists) {
                debugEmbed.addFields([
                    {
                        name: "🔧 État technique",
                        value: `**Canal vocal:** ${queueInfo.voiceChannel || 'Aucun'}\n` +
                               `**Canal texte:** ${queueInfo.textChannel || 'Aucun'}\n` +
                               `**Filtres actifs:** ${queueInfo.filters.join(', ') || 'Aucun'}\n` +
                               `**Message lecteur:** ${queueInfo.lastPlayerMessage ? '✅ Actif' : '❌ Aucun'}\n` +
                               `**Intervalle progression:** ${queueInfo.progressInterval ? '✅ Actif' : '❌ Aucun'}`,
                        inline: false
                    }
                ]);
            }

            debugEmbed.addFields([
                {
                    name: "📡 Événements DisTube",
                    value: distubeEvents.length > 0 ? 
                        distubeEvents.map(event => `✅ ${event}`).join('\n') :
                        '❌ Aucun événement DisTube chargé',
                    inline: false
                }
            ]);

            debugEmbed.setFooter({ 
                text: `Debug généré le ${new Date().toLocaleString('fr-FR')}` 
            });

            await interaction.editReply({ embeds: [debugEmbed] });

            // Logs détaillés dans la console
            console.log(`[${new Date().toISOString()}] [COMMAND] [DISTUBE_DEBUG] [DEBUG] Complete DisTube state:`);
            console.log('DisTube Info:', JSON.stringify(distubeInfo, null, 2));
            console.log('Queue Info:', JSON.stringify(queueInfo, null, 2));
            console.log('DisTube Events loaded:', distubeEvents);
            console.log(`[${new Date().toISOString()}] [COMMAND] [DISTUBE_DEBUG] [SUCCESS] Debug completed`);

        } catch (error) {
            console.error(`[${new Date().toISOString()}] [COMMAND] [DISTUBE_DEBUG] [ERROR] Debug failed:`, error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle("❌ Erreur de debug")
                .setDescription(`Impossible de récupérer les informations de debug:\n${error.message}`);

            if (interaction.deferred) {
                await interaction.editReply({ embeds: [errorEmbed] });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    }
};
