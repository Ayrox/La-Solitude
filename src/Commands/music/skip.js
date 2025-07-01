import * as Embed from "../../util/Embeds.js";
import * as ButtonRow from "../../util/buttonLayout.js";
import { generateProgressBar } from "../../util/functions.js";
import { SlashCommandBuilder } from "discord.js";

export const command = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Passe la musique en cours")
        .addIntegerOption((option) =>
            option
                .setName("number")
                .setDescription("Nombre de musiques à passer")
                .setRequired(false)
                .setMinValue(1)
        ),

    name: "skip",
    description: "Passe la musique en cours",
    permission: "ADMINISTRATOR",
    active: true,
    options: [
        {
            name: "number",
            description: `Nombre de musiques à passer`,
            type: "NUMBER",
            required: false,
        },
    ],

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

            let skipNumber = message.options.getInteger("number") || 1;
            
            // Vérifier si le nombre est valide
            if (skipNumber < 1) {
                return message.reply({
                    embeds: [
                        Embed.errorEmbed().setDescription(
                            `Le nombre de musiques à passer doit être supérieur à 0 !`
                        ),
                    ],
                    ephemeral: true,
                });
            }

            // Si on veut passer plus de musiques qu'il n'y en a dans la queue
            if (skipNumber >= queue.songs.length && !queue.autoplay) {
                return message.reply({
                    embeds: [
                        Embed.errorEmbed().setDescription(
                            `Il n'y a que ${queue.songs.length} musique(s) dans la file d'attente !`
                        ),
                    ],
                    ephemeral: true,
                });
            }

            // Déterminer la prochaine musique qui sera jouée
            let nextSong = null;
            if (skipNumber < queue.songs.length) {
                nextSong = queue.songs[skipNumber];
            }

            // Créer l'embed avec le même format que /play
            const embed = Embed.musicEmbed()
                .setTitle(`⏭️ | ${skipNumber === 1 ? 'Musique passée' : `${skipNumber} musiques passées`}`)
                .setThumbnail(queue.songs[0].thumbnail);

            if (nextSong) {
                embed.setDescription(`[${nextSong.name}](${nextSong.url})`)
                    .addFields(
                        {
                            name: `Passé par :`,
                            value: `${message.user}`,
                            inline: true
                        },
                        {
                            name: `Auteur :`,
                            value: `[${nextSong.uploader.name}](${nextSong.uploader.url})`,
                            inline: true
                        },
                        {
                            name: `Durée :`,
                            value: `${nextSong.formattedDuration}`,
                            inline: true
                        }
                    );
            } else if (queue.autoplay) {
                embed.setDescription(`**Mode autoplay activé** - Une musique sera automatiquement trouvée.`)
                    .addFields(
                        {
                            name: `Passé par :`,
                            value: `${message.user}`,
                            inline: true
                        },
                        {
                            name: `Mode :`,
                            value: `🔄 Autoplay`,
                            inline: true
                        },
                        {
                            name: `Statut :`,
                            value: `Recherche en cours...`,
                            inline: true
                        }
                    );
            }

            // Répondre avant de skip pour éviter les erreurs
            const response = await message.reply({
                embeds: [embed],
                components: [ButtonRow.musicButtonRow(), ButtonRow.musicButtonRow2()],
            });

            // Skip la/les musique(s)
            if (skipNumber === 1) {
                queue.skip();
            } else {
                queue.jump(skipNumber);
            }

            // Mise à jour de l'embed après le skip (comme dans /play)
            setTimeout(async () => {
                try {
                    const newQueue = client.distube.getQueue(message);
                    if (!newQueue || !newQueue.songs[0]) {
                        // Plus rien ne joue
                        const finalEmbed = Embed.musicEmbed()
                            .setTitle(`⏭️ | Musique passée`)
                            .setDescription(`**File d'attente terminée** - Plus aucune musique en cours.`)
                            .addFields(
                                {
                                    name: `Passé par :`,
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
                        .setTitle(`⏭️ | Musique passée - Maintenant en lecture :`)
                        .setDescription(`[${currentSong.name}](${currentSong.url})`)
                        .setThumbnail(currentSong.thumbnail)
                        .addFields(
                            {
                                name: `Passé par :`,
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

                    // Démarrer la mise à jour de la barre de progression toutes les 5 secondes (comme dans /play)
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
                                console.log("Musique terminée dans /skip, arrêt de la mise à jour");
                                clearInterval(updateInterval);
                                return;
                            }
                            
                            try {
                                // Mettre à jour l'embed avec la nouvelle barre de progression
                                const progressEmbed = Embed.musicEmbed()
                                    .setTitle(`⏭️ | Musique passée - Maintenant en lecture :`)
                                    .setDescription(`[${nowPlayingSong.name}](${nowPlayingSong.url})`)
                                    .setThumbnail(nowPlayingSong.thumbnail)
                                    .addFields(
                                        {
                                            name: `Passé par :`,
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
                    console.error('Erreur lors de la mise à jour du message après skip:', updateError);
                }
            }, 1000);

        } catch (e) {
            console.error('Erreur dans la commande skip:', e);
            message.reply({
                embeds: [
                    Embed.errorEmbed().setDescription(
                        `Une erreur est survenue lors du passage de la musique : ${e.message}`
                    )
                ],
                ephemeral: true,
            });
        }
    },
};
