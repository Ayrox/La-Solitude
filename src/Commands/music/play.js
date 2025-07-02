import { ChatInputCommandInteraction, Client, Message, SlashCommandBuilder } from "discord.js";
import { joinVoiceChannel } from "@discordjs/voice";
import * as Embed from "../../util/Embeds.js";
import * as ButtonRow from "../../util/buttonLayout.js";
import { generateProgressBar } from "../../util/functions.js";
 

export const command = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription(
            "Joue une musique ou une playlist depuis Youtube ou une URL"
        )
        .addStringOption((option) =>
            option
                .setName("musique")
                .setDescription("url ou nom de la musique a jouer")
                .setRequired(true)
        ),
    
    /**
     * 
     * @param {ChatInputCommandInteraction} message 
     * @param {Client} client 
     * @returns 
     */
    async execute(message, client) {
        // Déférer la réponse immédiatement pour éviter l'expiration
        await message.deferReply();

        // Vérifier si DisTube est disponible
        if (!client.distube) {
            console.error('[PLAY] DisTube n\'est pas initialisé sur le client');
            console.error('[PLAY] Client disponible:', !!client);
            console.error('[PLAY] Propriétés du client:', Object.keys(client));
            return message.editReply({
                embeds: [
                    Embed.errorEmbed().setDescription(
                        `❌ Le système de musique n'est pas disponible actuellement.`
                    ),
                ],
            });
        }

        console.log('[PLAY] DisTube disponible, tentative de lecture...');

        const { channel } = message.member.voice;
        let addedSong

        if (!channel)
            return message.editReply({
                embeds: [
                    Embed.errorEmbed().setDescription(
                        `Vous devez rejoindre un salon vocal !`
                    ),
                ],
            });

        const music = message.options.getString("musique");
        if (music == "") return message.editReply({
            embeds: [Embed.errorEmbed().setDescription("Veuillez spécifier une musique à jouer.")],
        });

        /*await joinVoiceChannel({
            channelId: channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
        });*/

        if (music.startsWith("http")) {
            try {
                await client.distube.play(channel, music, {
                    textChannel: message.channel,
                    member: message.member
                });
                const queue = client.distube.getQueue(message);
                let numberSongs = queue.songs.length - 1;
                addedSong = queue.songs[numberSongs];
            } catch (e) {
                console.log(`[PLAY] Erreur lors de la lecture (URL):`, e.message || e);
                
                let errorMessage = "Une erreur s'est produite lors de la lecture.";
                
                if (e.errorCode === 'NO_RESULT') {
                    errorMessage = `🔍 Aucune musique trouvée avec cette URL\n\n**Vérifiez:**\n• Que le lien est valide\n• Que la vidéo est publique\n• Que la vidéo existe encore`;
                } else if (e.errorCode === 'FFMPEG_NOT_INSTALLED') {
                    errorMessage = "❌ Erreur du système audio. Veuillez réessayer plus tard.";
                } else if (e.message) {
                    errorMessage = `❌ Erreur: ${e.message}`;
                }
                
                message.editReply({
                    embeds: [Embed.errorEmbed().setDescription(errorMessage)],
                });
                return;
            }
        } else {
            try { 
                // Utiliser directement client.distube.play avec le terme de recherche
                await client.distube.play(channel, music, {
                    textChannel: message.channel,
                    member: message.member
                });
                
                const queue = client.distube.getQueue(message);
                let numberSongs = queue.songs.length - 1;
                addedSong = queue.songs[numberSongs];
            } catch (e) {
                console.log(`[PLAY] Erreur lors de la lecture:`, e.message || e);
                
                let errorMessage = "Une erreur s'est produite lors de la lecture.";
                
                if (e.errorCode === 'NO_RESULT') {
                    errorMessage = `🔍 Aucune musique trouvée pour: **${music}**\n\n**Essayez:**\n• Un titre plus précis\n• Le nom de l'artiste + titre\n• Un lien YouTube direct`;
                } else if (e.errorCode === 'FFMPEG_NOT_INSTALLED') {
                    errorMessage = "❌ Erreur du système audio. Veuillez réessayer plus tard.";
                } else if (e.message) {
                    errorMessage = `❌ Erreur: ${e.message}`;
                }
                
                message.editReply({
                    embeds: [Embed.errorEmbed().setDescription(errorMessage)],
                });
                return;
            }
        }

        try {
            if (!addedSong) {
                message.editReply({
                    embeds: [Embed.errorEmbed().setDescription("Erreur lors de la récupération des informations de la musique.")],
                });
                return;
            }

            const queue = client.distube.getQueue(message);
            
            // Créer l'embed avec les informations de base
            const embed = Embed.musicEmbed()
                .setTitle(`▶️ | Une musique a été ajoutée à la file d'attente : `)
                .setDescription(`[${addedSong.name}](${addedSong.url})`)
                .setThumbnail(`${addedSong.thumbnail}`)
                .addFields(
                    {
                        name: `Demandé par :`,
                        value: `${message.user} `,
                        inline: true
                    },
                    {
                        name: `Auteur :`,
                        value: `[${addedSong.uploader.name}](${addedSong.uploader.url})`,
                        inline: true
                    },
                    {
                        name: `Durée :`,
                        value: `${addedSong.formattedDuration}`,
                        inline: true
                    }
                );

            // Si une musique est en cours de lecture, afficher la barre de progression
            if (queue && queue.playing && queue.songs[0]) {
                const currentSong = queue.songs[0];
                embed.addFields({
                    name: `🎵 Actuellement en lecture :`,
                    value: `[${currentSong.name}](${currentSong.url})\n**${queue.formattedCurrentTime} ${generateProgressBar(
                        queue.currentTime,
                        currentSong.duration,
                        queue.paused
                    )} ${currentSong.formattedDuration}**`,
                    inline: false
                });
            }

            const response = await message.editReply({
                embeds: [embed],
                components: [ButtonRow.musicButtonRow(), ButtonRow.musicButtonRow2()],
            });

            // Démarrer la mise à jour de la barre de progression toutes les 5 secondes
            if (queue && queue.playing) {
                const currentSong = queue.songs[0];
                const songDurationMs = currentSong.duration * 1000; // Convertir en millisecondes
                
                const updateInterval = setInterval(() => {
                    const currentQueue = client.distube.getQueue(message);
                    
                    // Vérifier si la queue existe toujours
                    if (!currentQueue || !currentQueue.songs[0]) {
                        clearInterval(updateInterval);
                        return;
                    }

                    const nowPlayingSong = currentQueue.songs[0];
                    
                    // Vérifier si c'est toujours la même musique
                    if (nowPlayingSong.name !== currentSong.name) {
                        clearInterval(updateInterval);
                        return;
                    }
                    
                    // Vérifier si la musique est terminée
                    if (currentQueue.currentTime >= nowPlayingSong.duration) {
                        console.log("Musique terminée dans /play, arrêt de la mise à jour");
                        clearInterval(updateInterval);
                        return;
                    }
                    
                    // Recréer l'embed avec les informations mises à jour
                    const updatedEmbed = Embed.musicEmbed()
                        .setTitle(`▶️ | Une musique a été ajoutée à la file d'attente : `)
                        .setDescription(`[${addedSong.name}](${addedSong.url})`)
                        .setThumbnail(`${addedSong.thumbnail}`)
                        .addFields(
                            {
                                name: `Demandé par :`,
                                value: `${message.user} `,
                                inline: true
                            },
                            {
                                name: `Auteur :`,
                                value: `[${addedSong.uploader.name}](${addedSong.uploader.url})`,
                                inline: true
                            },
                            {
                                name: `Durée :`,
                                value: `${addedSong.formattedDuration}`,
                                inline: true
                            },
                            {
                                name: `🎵 Actuellement en lecture :`,
                                value: `[${nowPlayingSong.name}](${nowPlayingSong.url})\n**${currentQueue.formattedCurrentTime} ${generateProgressBar(
                                    currentQueue.currentTime,
                                    nowPlayingSong.duration,
                                    currentQueue.paused
                                )} ${nowPlayingSong.formattedDuration}**`,
                                inline: false
                            }
                        );

                    response.edit({
                        embeds: [updatedEmbed],
                        components: [ButtonRow.musicButtonRow(), ButtonRow.musicButtonRow2()],
                    }).catch(() => {
                        // Si l'édition échoue, arrêter la mise à jour
                        clearInterval(updateInterval);
                    });
                }, 5000);

                // Arrêter automatiquement l'intervalle après la durée de la musique + 10 secondes de marge
                setTimeout(() => {
                    console.log("Timeout atteint pour la durée de la musique dans /play, arrêt de la mise à jour");
                    clearInterval(updateInterval);
                }, songDurationMs + 10000);
            }
        } catch (e) {
            console.log(e);
            message.editReply({
                embeds: [Embed.errorEmbed().setDescription(`${e}`)],
            });
        }
    },
};
