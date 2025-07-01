import { ButtonInteraction, Client } from "discord.js";
import * as Embed from "../../Util/Embeds.js";
import * as ButtonRow from "../../Util/buttonLayout.js";
import { generateProgressBar } from "../../Util/functions.js";
import db from "../../Models/playlist.js";

export const event = {
    name: "interactionCreate",

    async execute(interaction, client) {
        if (!interaction.isButton()) return;
        //if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ embeds: [Embed.errorEmbeds().setDescription("You don't have permission to use this button!")], ephemeral: true });

        const { guildId, customId, message } = interaction;

        let buttonsID = ["pause", "skip", "shuffle", "previous", "repeat"];
        if (!buttonsID.includes(customId)) return;

        const queue = client.distube.getQueue(interaction);
        if (!queue)
            return interaction.reply({
                embeds: [
                    Embed.errorEmbed().setDescription(
                        `La file d'attente est actuellement vide !`
                    ),
                ],
                ephemeral: true,
            });

        switch (customId) {
            //! Pause Button

            case "pause":
                {
                    try {
                        let playingSong = queue.songs[0];

                        if (queue.paused) {
                            queue.resume();
                            await interaction.message.edit({
                                embeds: [
                                    Embed.musicEmbed()
                                        .setTitle(
                                            `Musique actuelle : ${playingSong.name}`
                                        )
                                        .setURL(`${playingSong.url}`)
                                        .setThumbnail(
                                            `${playingSong.thumbnail}`
                                        )
                                        .addFields(
                                            {
                                                name: `Demandé par :`,
                                                value: `${playingSong.member}`,
                                                inline: true
                                            },
                                            {
                                                name: `Auteur :`,
                                                value: `[${playingSong.uploader.name}](${playingSong.uploader.url})`,
                                                inline: true
                                            },
                                            {
                                                name: `Volume :`,
                                                value: `${queue.volume}%`,
                                                inline: true
                                            }
                                        ),
                                ],
                                components: [
                                    ButtonRow.musicButtonRow(),
                                    ButtonRow.musicButtonRow2(),
                                ],
                                ephemeral: true,
                            });
                            return interaction.deferUpdate();
                        }

                        queue.pause();
                        await interaction.message.edit({
                            embeds: [
                                Embed.musicEmbed()
                                    .setTitle(
                                        `${interaction.user.username} a mis en pause la musique ${playingSong.name}`
                                    )
                                    .setURL(`${playingSong.url}`)
                                    .setThumbnail(`${playingSong.thumbnail}`)
                                    .setDescription(
                                        `${
                                            queue.formattedCurrentTime
                                        } **${generateProgressBar(
                                            queue.currentTime,
                                            playingSong.duration,
                                            true
                                        )}** ${playingSong.formattedDuration}`
                                    )
                                    .addFields(
                                        {
                                            name: `Demandé par :`,
                                            value: `${playingSong.user}`,
                                            inline: true
                                        },
                                        {
                                            name: `Auteur :`,
                                            value: `[${playingSong.uploader.name}](${playingSong.uploader.url})`,
                                            inline: true
                                        },
                                        {    
                                            name: `Volume :`,
                                            value: `${queue.volume}%`,
                                            inline: true
                                        }
                                    ),
                            ],
                            components: [ButtonRow.musicButtonRow(), ButtonRow.musicButtonRow2()],
                            ephemeral: true,
                        });
                        interaction.deferUpdate();
                    } catch (e) {
                        interaction.reply({
                            embeds: [Embed.errorEmbed().setDescription(`${e}`)],
                            ephemeral: true,
                        });
                    }
                }
                break;

            //! Previous Button
            case "previous":
                {
                    let previousSong;
                    try {
                        previousSong =
                            queue.previousSongs[queue.previousSongs.length - 1];
                    } catch (e) {
                        console.log(e);
                    }

                    if (previousSong === undefined)
                        return interaction.reply({
                            embeds: [
                                Embed.errorEmbed().setDescription(
                                    `Rien n'a été joué précédement !`
                                ),
                            ],
                            ephemeral: true,
                        });
                    try {
                        // Créer l'embed initial avec la même interface que /skip
                        const embed = Embed.musicEmbed()
                            .setTitle(`⏮️ | Retour à la musique précédente`)
                            .setDescription(`[${previousSong.name}](${previousSong.url})`)
                            .setThumbnail(previousSong.thumbnail)
                            .addFields(
                                {
                                    name: `Demandé par :`,
                                    value: `${interaction.user}`,
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

                        await interaction.message.edit({
                            embeds: [embed],
                            components: [ButtonRow.musicButtonRow(), ButtonRow.musicButtonRow2()],
                        });

                        // Exécuter le retour en arrière
                        queue.previous();
                        
                        // Mise à jour après le changement de musique
                        setTimeout(async () => {
                            try {
                                const newQueue = client.distube.getQueue(interaction);
                                if (!newQueue || !newQueue.songs[0]) {
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
                                            value: `${interaction.user}`,
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

                                // Ajouter la barre de progression
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

                                await interaction.message.edit({
                                    embeds: [updatedEmbed],
                                    components: [ButtonRow.musicButtonRow(), ButtonRow.musicButtonRow2()],
                                });

                                // Démarrer la mise à jour automatique de la barre de progression
                                if (newQueue && newQueue.playing) {
                                    const updateInterval = setInterval(async () => {
                                        const currentQueue = client.distube.getQueue(interaction);
                                        
                                        if (!currentQueue || !currentQueue.songs[0]) {
                                            clearInterval(updateInterval);
                                            return;
                                        }

                                        const nowPlayingSong = currentQueue.songs[0];
                                        
                                        if (nowPlayingSong.name !== currentSong.name) {
                                            clearInterval(updateInterval);
                                            return;
                                        }
                                        
                                        if (currentQueue.currentTime >= nowPlayingSong.duration) {
                                            clearInterval(updateInterval);
                                            return;
                                        }
                                        
                                        try {
                                            const progressEmbed = Embed.musicEmbed()
                                                .setTitle(`⏮️ | Retour effectué - Maintenant en lecture :`)
                                                .setDescription(`[${nowPlayingSong.name}](${nowPlayingSong.url})`)
                                                .setThumbnail(nowPlayingSong.thumbnail)
                                                .addFields(
                                                    {
                                                        name: `Demandé par :`,
                                                        value: `${interaction.user}`,
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

                                            await interaction.message.edit({
                                                embeds: [progressEmbed],
                                                components: [ButtonRow.musicButtonRow(), ButtonRow.musicButtonRow2()],
                                            });
                                        } catch (progressUpdateError) {
                                            clearInterval(updateInterval);
                                        }
                                    }, 5000);
                                }
                            } catch (updateError) {
                                console.error('Erreur lors de la mise à jour du bouton previous:', updateError);
                            }
                        }, 1000);

                        interaction.deferUpdate();
                    } catch (e) {
                        interaction.reply({
                            embeds: [Embed.errorEmbed().setDescription(`${e}`)],
                            ephemeral: true,
                        });
                    }
                }
                break;

            //! Repeat Button
            case "repeat":
                {
                    try {
                        if (!queue) {
                            return interaction.reply({
                                embeds: [
                                    Embed.errorEmbed().setDescription(
                                        `Aucune musique n'est actuellement en cours de lecture !`
                                    ),
                                ],
                                ephemeral: true,
                            });
                        }

                        // Cycle automatique : 0 -> 1 -> 2 -> 0
                        const currentMode = queue.repeatMode;
                        const newMode = (currentMode + 1) % 3;
                        const setMode = queue.setRepeatMode(newMode);

                        // Déterminer le texte et l'icône du mode
                        let modeText;
                        let modeIcon;
                        switch (setMode) {
                            case 0:
                                modeText = "Désactivé";
                                modeIcon = "🔁";
                                break;
                            case 1:
                                modeText = "Répétition de la musique";
                                modeIcon = "🔂";
                                break;
                            case 2:
                                modeText = "Répétition de la file d'attente";
                                modeIcon = "🔁";
                                break;
                            default:
                                modeText = "Désactivé";
                                modeIcon = "🔁";
                        }

                        const currentSong = queue.songs[0];
                        const embed = Embed.musicEmbed()
                            .setTitle(`${modeIcon} | Mode de répétition modifié`)
                            .setDescription(`[${currentSong.name}](${currentSong.url})`)
                            .setThumbnail(currentSong.thumbnail)
                            .addFields(
                                {
                                    name: `Modifié par :`,
                                    value: `${interaction.user}`,
                                    inline: true
                                },
                                {
                                    name: `Mode de répétition :`,
                                    value: `${modeIcon} ${modeText}`,
                                    inline: true
                                },
                                {
                                    name: `Statut :`,
                                    value: `${queue.playing ? '▶️ En cours' : '⏸️ En pause'}`,
                                    inline: true
                                }
                            );

                        await interaction.message.edit({
                            embeds: [embed],
                            components: [ButtonRow.musicButtonRow(), ButtonRow.musicButtonRow2()],
                        });
                        
                        interaction.deferUpdate();
                    } catch (e) {
                        console.error('Erreur dans le bouton repeat:', e);
                        interaction.reply({
                            embeds: [
                                Embed.errorEmbed().setDescription(
                                    `Une erreur est survenue lors de la modification du mode de répétition : ${e.message}`
                                )
                            ],
                            ephemeral: true,
                        });
                    }
                }
                break;

            //! Shuffle Button
            case "shuffle":
                {
                    try {
                        queue.shuffle();

                        interaction.message.edit({
                            embeds: [
                                Embed.musicEmbed().setDescription(
                                    `🔀 | ${interaction.user} a mélangé les musiques de la file d'attente...`
                                ),
                            ],
                            components: [ButtonRow.musicButtonRow(), ButtonRow.musicButtonRow2()],
                        });
                        interaction.deferUpdate();
                    } catch (e) {
                        interaction.reply({
                            embeds: [Embed.errorEmbed().setDescription(`${e}`)],
                            ephemeral: true,
                        });
                    }
                }
                break;

            //! Like Button
            case "like":
                {
                    try {
                        db.findOne(
                            {
                                GuildID: message.guild.id,
                            },
                            async (err, data) => {
                                if (err) throw err;
                                if (!data) {
                                    data = new db({
                                        GuildID: message.guild.id,
                                        LogChannelID: message.channel.id,
                                    });
                                } else {
                                    data.LogChannelID = message.channel.id;
                                }
                                data.save();
                            }
                        );
                    } catch (e) {
                        interaction.reply({
                            embeds: [Embed.errorEmbed().setDescription(`${e}`)],
                            ephemeral: true,
                        });
                    }
                }
                break;

            //! Skip Button
            case "skip":
                {
                    try {
                        const currentSong = queue.songs[0];
                        const nextSong = queue.songs[1];

                        // Vérifier s'il y a une prochaine musique ou si autoplay est activé
                        if (!nextSong && !queue.autoplay) {
                            return interaction.reply({
                                embeds: [
                                    Embed.errorEmbed().setDescription(
                                        `La file d'attente est actuellement vide et l'autoplay est désactivé !`
                                    ),
                                ],
                                ephemeral: true,
                            });
                        }

                        // Créer l'embed initial avec la même interface que /skip
                        const embed = Embed.musicEmbed()
                            .setTitle(`⏭️ | Musique passée`)
                            .setThumbnail(currentSong.thumbnail);

                        if (nextSong) {
                            embed.setDescription(`[${nextSong.name}](${nextSong.url})`)
                                .addFields(
                                    {
                                        name: `Passé par :`,
                                        value: `${interaction.user}`,
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
                                        value: `${interaction.user}`,
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

                        await interaction.message.edit({
                            embeds: [embed],
                            components: [ButtonRow.musicButtonRow(), ButtonRow.musicButtonRow2()],
                        });
                        
                        // Skip d'abord
                        queue.skip();
                        
                        // Attendre un peu pour que la nouvelle musique soit chargée
                        setTimeout(async () => {
                            try {
                                const newQueue = client.distube.getQueue(interaction);
                                if (!newQueue || !newQueue.songs[0]) {
                                    // Si plus rien ne joue, mettre à jour avec un message approprié
                                    const finalEmbed = Embed.musicEmbed()
                                        .setTitle(`⏭️ | Musique passée`)
                                        .setDescription(`**File d'attente terminée** - Plus aucune musique en cours.`)
                                        .addFields(
                                            {
                                                name: `Passé par :`,
                                                value: `${interaction.user}`,
                                                inline: true
                                            },
                                            {
                                                name: `Statut :`,
                                                value: `🛑 Arrêtée`,
                                                inline: true
                                            }
                                        );
                                    
                                    await interaction.message.edit({
                                        embeds: [finalEmbed],
                                        components: [],
                                    });
                                } else {
                                    const newCurrentSong = newQueue.songs[0];
                                    const updatedEmbed = Embed.musicEmbed()
                                        .setTitle(`⏭️ | Musique passée - Maintenant en lecture :`)
                                        .setDescription(`[${newCurrentSong.name}](${newCurrentSong.url})`)
                                        .setThumbnail(newCurrentSong.thumbnail)
                                        .addFields(
                                            {
                                                name: `Passé par :`,
                                                value: `${interaction.user}`,
                                                inline: true
                                            },
                                            {
                                                name: `Auteur :`,
                                                value: `[${newCurrentSong.uploader.name}](${newCurrentSong.uploader.url})`,
                                                inline: true
                                            },
                                            {
                                                name: `Durée :`,
                                                value: `${newCurrentSong.formattedDuration}`,
                                                inline: true
                                            }
                                        );

                                    // Ajouter la barre de progression
                                    if (newQueue.playing) {
                                        updatedEmbed.addFields({
                                            name: `🎵 Actuellement en lecture :`,
                                            value: `[${newCurrentSong.name}](${newCurrentSong.url})\n**${newQueue.formattedCurrentTime} ${generateProgressBar(
                                                newQueue.currentTime,
                                                newCurrentSong.duration,
                                                newQueue.paused
                                            )} ${newCurrentSong.formattedDuration}**`,
                                            inline: false
                                        });
                                    }

                                    await interaction.message.edit({
                                        embeds: [updatedEmbed],
                                        components: [ButtonRow.musicButtonRow(), ButtonRow.musicButtonRow2()],
                                    });

                                    // Démarrer la mise à jour automatique de la barre de progression
                                    if (newQueue && newQueue.playing) {
                                        const updateInterval = setInterval(async () => {
                                            const currentQueue = client.distube.getQueue(interaction);
                                            
                                            if (!currentQueue || !currentQueue.songs[0]) {
                                                clearInterval(updateInterval);
                                                return;
                                            }

                                            const nowPlayingSong = currentQueue.songs[0];
                                            
                                            if (nowPlayingSong.name !== newCurrentSong.name) {
                                                clearInterval(updateInterval);
                                                return;
                                            }
                                            
                                            if (currentQueue.currentTime >= nowPlayingSong.duration) {
                                                clearInterval(updateInterval);
                                                return;
                                            }
                                            
                                            try {
                                                const progressEmbed = Embed.musicEmbed()
                                                    .setTitle(`⏭️ | Musique passée - Maintenant en lecture :`)
                                                    .setDescription(`[${nowPlayingSong.name}](${nowPlayingSong.url})`)
                                                    .setThumbnail(nowPlayingSong.thumbnail)
                                                    .addFields(
                                                        {
                                                            name: `Passé par :`,
                                                            value: `${interaction.user}`,
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

                                                await interaction.message.edit({
                                                    embeds: [progressEmbed],
                                                    components: [ButtonRow.musicButtonRow(), ButtonRow.musicButtonRow2()],
                                                });
                                            } catch (progressUpdateError) {
                                                clearInterval(updateInterval);
                                            }
                                        }, 5000);
                                    }
                                }
                            } catch (updateError) {
                                console.error('Erreur lors de la mise à jour du message après skip:', updateError);
                            }
                        }, 1000);

                        interaction.deferUpdate();
                    } catch (e) {
                        console.error('Erreur dans le bouton skip:', e);
                        interaction.reply({
                            embeds: [Embed.errorEmbed().setDescription(`Une erreur est survenue : ${e.message}`)],
                            ephemeral: true,
                        });
                    }
                }
                break;
        }
    },
};
