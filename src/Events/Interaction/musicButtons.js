import { ButtonInteraction, Client } from "discord.js";
import { errorEmbed, musicEmbed } from "../../util/Embeds.js";
import { musicButtonRow, musicButtonRow2 } from "../../util/buttonLayout.js";
import { generateProgressBar } from "../../util/functions.js";
import db from "../../Models/playlist.js";

export default {
    name: "interactionCreate",

    async execute(interaction, client) {
        if (!interaction.isButton()) return;
        //if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ embeds: [errorEmbeds().setDescription("You don't have permission to use this button!")], ephemeral: true });

        const { guildId, customId, message } = interaction;

        buttonsID = ["pause", "skip", "shuffle", "previous", "repeat"];
        if (!buttonsID.includes(customId)) return;

        const queue = client.distube.getQueue(interaction);
        if (!queue)
            return interaction.reply({
                embeds: [
                    errorEmbed().setDescription(
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
                                    musicEmbed()
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
                                    musicButtonRow(),
                                    musicButtonRow2(),
                                ],
                                ephemeral: true,
                            });
                            return interaction.deferUpdate();
                        }

                        queue.pause();
                        await interaction.message.edit({
                            embeds: [
                                musicEmbed()
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
                            components: [musicButtonRow(), musicButtonRow2()],
                            ephemeral: true,
                        });
                        interaction.deferUpdate();
                    } catch (e) {
                        interaction.reply({
                            embeds: [errorEmbed().setDescription(`${e}`)],
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
                                errorEmbed().setDescription(
                                    `Rien n'a été joué précédement !`
                                ),
                            ],
                            ephemeral: true,
                        });
                    try {
                        queue.previous();

                        interaction.message.edit({
                            embeds: [
                                musicEmbed()
                                    .setThumbnail(`${previousSong.thumbnail}`)
                                    .setDescription(
                                        `Le son a été passé par ${interaction.user}! Musique actuelle :\n [${previousSong.name}](${previousSong.url})`
                                    ),
                            ],

                            components: [musicButtonRow(), musicButtonRow2()],
                        });
                        interaction.deferUpdate();
                    } catch (e) {
                        interaction.reply({
                            embeds: [errorEmbed().setDescription(`${e}`)],
                            ephemeral: true,
                        });
                    }
                }
                break;

            //! Repeat Button
            case "repeat":
                {
                    try {
                        if (!queue)
                            return interaction.reply({
                                embeds: [
                                    errorEmbed().setDescription(
                                        `There is nothing to play :( !`
                                    ),
                                ],
                                ephemeral: true,
                            });
                        mode = queue.setRepeatMode();
                        mode = mode
                            ? mode === 2
                                ? "Répétition de la file d'attente"
                                : "Répétition de la musique"
                            : "Désactiver";

                        interaction.message.edit({
                            embeds: [
                                musicEmbed().setDescription(
                                    `🔁 | ${interaction.user} a défini le mode de répétition sur ${mode}`
                                ),
                            ],
                        });
                        interaction.deferUpdate();
                    } catch (e) {
                        interaction.reply({
                            embeds: [errorEmbed().setDescription(`${e}`)],
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
                                musicEmbed().setDescription(
                                    `🔀 | ${interaction.user} a mélangé les musiques de la file d'attente...`
                                ),
                            ],
                            components: [musicButtonRow(), musicButtonRow2()],
                        });
                        interaction.deferUpdate();
                    } catch (e) {
                        interaction.reply({
                            embeds: [errorEmbed().setDescription(`${e}`)],
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
                            embeds: [errorEmbed().setDescription(`${e}`)],
                            ephemeral: true,
                        });
                    }
                }
                break;

            //! Skip Button
            case "skip":
                {
                    try {
                        const nextSong = queue.songs[1];

                        if (nextSong === undefined && queue.autoplay === false)
                            return interaction.reply({
                                embeds: [
                                    errorEmbed().setDescription(
                                        `La file d'attente est actuellement vide !`
                                    ),
                                ],
                                ephemeral: true,
                            });

                        interaction.message.edit({
                            embeds: [
                                musicEmbed()
                                    .setThumbnail(`${nextSong.thumbnail}`)
                                    .setDescription(
                                        ` La musique a été passée par ${interaction.user}! Musique actuelle :\n [${nextSong.name}](${nextSong.url})`
                                    ),
                            ],
                            components: [musicButtonRow(), musicButtonRow2()],
                        });
                        interaction.deferUpdate();
                        queue.skip();
                    } catch (e) {
                        interaction.reply({
                            embeds: [errorEmbed().setDescription(`${e}`)],
                            ephemeral: true,
                        });
                    }
                }
                break;
        }
    },
};
