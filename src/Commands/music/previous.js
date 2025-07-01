import * as Embed from "../../util/Embeds.js";
import * as ButtonRow from "../../util/buttonLayout.js";
import { generateProgressBar } from "../../util/functions.js";
import { SlashCommandBuilder } from "discord.js";

export const command = {
    data: new SlashCommandBuilder()
        .setName("previous")
        .setDescription("Rejoue la musique précédente"),

    name: "previous",
    description: "Rejoue la musique précédente",
    permission: "ADMINISTRATOR",
    active: true,

    async execute(message, client) {
        try {
            // Vérifier si l'utilisateur est dans un canal vocal
            if (!message.member.voice.channel) {
                return message.reply({
                    embeds: [
                        Embed.errorEmbed().setDescription(
                            `Vous devez être dans un canal vocal pour utiliser cette commande !`
                        ),
                    ],
                    ephemeral: true,
                });
            }

            // Récupérer la queue
            const queue = client.distube.getQueue(message);
            if (!queue) {
                return message.reply({
                    embeds: [
                        Embed.errorEmbed().setDescription(
                            `Aucune musique n'est actuellement en cours de lecture !`
                        ),
                    ],
                    ephemeral: true,
                });
            }

            // Vérifier s'il y a une musique précédente
            const previousSong = queue.previousSongs[queue.previousSongs.length - 1];
            if (!previousSong) {
                return message.reply({
                    embeds: [
                        Embed.errorEmbed().setDescription(
                            `Rien n'a été joué précédement !`
                        ),
                    ],
                    ephemeral: true,
                });
            }

            // Créer l'embed initial avec la même interface que /skip
            const embed = Embed.musicEmbed()
                .setTitle(`⏮️ | Retour à la musique précédente`)
                .setDescription(`[${previousSong.name}](${previousSong.url})`)
                .setThumbnail(previousSong.thumbnail)
                .addFields(
                    {
                        name: `Demandé par :`,
                        value: `${message.user}`,
                        inline: true
                    },
                    {
                        name: `Auteur :`,
                        value: `[${previousSong.uploader.name}](${previousSong.uploader.url})`,
                        inline: true
                    },
                    {
                        name: `Durée :`,
                        value: `${previousSong.formattedDuration}`,
                        inline: true
                    }
                );

            // Répondre avant de faire le previous pour éviter les erreurs
            const response = await message.reply({
                embeds: [embed],
                components: [ButtonRow.musicButtonRow(), ButtonRow.musicButtonRow2()],
            });

            // Exécuter le retour en arrière
            queue.previous();

            // Mise à jour de l'embed après le previous (comme dans /skip)
            setTimeout(async () => {
                try {
                    const newQueue = client.distube.getQueue(message);
                    if (!newQueue || !newQueue.songs[0]) {
                        // Plus rien ne joue
                        const finalEmbed = Embed.musicEmbed()
                            .setTitle(`⏮️ | Retour effectué`)
                            .setDescription(`**File d'attente terminée** - Plus aucune musique en cours.`)
                            .addFields(
                                {
                                    name: `Demandé par :`,
                                    value: `${message.user}`,
                                    inline: true
                                },
                                {
                                    name: `Statut :`,
                                    value: `🛑 Arrêtée`,
                                    inline: true
                                }
                            );
                        
                        await response.edit({
                            embeds: [finalEmbed],
                            components: [],
                        });
                        return;
                    }

                    const currentSong = newQueue.songs[0];
                    const updatedEmbed = Embed.musicEmbed()
                        .setTitle(`⏮️ | Retour effectué - Maintenant en lecture :`)
                        .setDescription(`[${currentSong.name}](${currentSong.url})`)
                        .setThumbnail(currentSong.thumbnail)
                        .addFields(
                            {
                                name: `Demandé par :`,
                                value: `${message.user}`,
                                inline: true
                            },
                            {
                                name: `Auteur :`,
                                value: `[${currentSong.uploader.name}](${currentSong.uploader.url})`,
                                inline: true
                            },
                            {
                                name: `Durée :`,
                                value: `${currentSong.formattedDuration}`,
                                inline: true
                            }
                        );

                    // Ajouter la barre de progression si la musique est en cours
                    if (newQueue.playing) {
                        updatedEmbed.addFields({
                            name: `🎵 Actuellement en lecture :`,
                            value: `[${currentSong.name}](${currentSong.url})\n**${newQueue.formattedCurrentTime} ${generateProgressBar(
                                newQueue.currentTime,
                                currentSong.duration,
                                newQueue.paused
                            )} ${currentSong.formattedDuration}**`,
                            inline: false
                        });
                    }

                    await response.edit({
                        embeds: [updatedEmbed],
                        components: [ButtonRow.musicButtonRow(), ButtonRow.musicButtonRow2()],
                    });

                    // Démarrer la mise à jour de la barre de progression toutes les 5 secondes (comme dans /skip)
                    if (newQueue && newQueue.playing) {
                        const songDurationMs = currentSong.duration * 1000; // Convertir en millisecondes
                        
                        const updateInterval = setInterval(async () => {
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
                                console.log("Musique terminée dans /previous, arrêt de la mise à jour");
                                clearInterval(updateInterval);
                                return;
                            }
                            
                            try {
                                // Mettre à jour l'embed avec la nouvelle barre de progression
                                const progressEmbed = Embed.musicEmbed()
                                    .setTitle(`⏮️ | Retour effectué - Maintenant en lecture :`)
                                    .setDescription(`[${nowPlayingSong.name}](${nowPlayingSong.url})`)
                                    .setThumbnail(nowPlayingSong.thumbnail)
                                    .addFields(
                                        {
                                            name: `Demandé par :`,
                                            value: `${message.user}`,
                                            inline: true
                                        },
                                        {
                                            name: `Auteur :`,
                                            value: `[${nowPlayingSong.uploader.name}](${nowPlayingSong.uploader.url})`,
                                            inline: true
                                        },
                                        {
                                            name: `Durée :`,
                                            value: `${nowPlayingSong.formattedDuration}`,
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

                                await response.edit({
                                    embeds: [progressEmbed],
                                    components: [ButtonRow.musicButtonRow(), ButtonRow.musicButtonRow2()],
                                });
                            } catch (progressUpdateError) {
                                console.error('Erreur lors de la mise à jour de la barre de progression:', progressUpdateError);
                                clearInterval(updateInterval);
                            }
                        }, 5000); // Mise à jour toutes les 5 secondes
                    }

                } catch (updateError) {
                    console.error('Erreur lors de la mise à jour du message après previous:', updateError);
                }
            }, 1000);

        } catch (e) {
            console.error('Erreur dans la commande previous:', e);
            message.reply({
                embeds: [
                    Embed.errorEmbed().setDescription(
                        `Une erreur est survenue lors du retour à la musique précédente : ${e.message}`
                    )
                ],
                ephemeral: true,
            });
        }
    },
};
