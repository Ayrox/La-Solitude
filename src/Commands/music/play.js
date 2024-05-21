import { Message, SlashCommandBuilder } from "discord.js";
import { joinVoiceChannel } from "@discordjs/voice";
import * as Embed from "../../util/Embeds";
import * as ButtonRow from "../../util/buttonLayout";
 

export default {
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

    async execute(message, client) {
        channel = message.member.voice.channel;
        if (!channel)
            return message.reply({
                embeds: [
                    Embed.errorEmbed().setDescription(
                        `Vous devez rejoindre un salon vocal !`
                    ),
                ],
                ephemeral: true,
            });

        const music = message.options.getString("musique");
        if (music == "") return;

        message.deferReply({ ephemeral: false });

        await joinVoiceChannel({
            channelId: channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
        });

        if (music.startsWith("http")) {
            try {
                await client.distube.playVoiceChannel(channel, music, {
                    options: message.user,
                });
                const queue = client.distube.getQueue(message);
                numberSongs = queue.songs.length - 1;
                addedSong = queue.songs[numberSongs];
            } catch (e) {
                console.log(e);
                message.editReply({
                    embeds: [Embed.errorEmbed().setDescription(`${e}`)],
                    ephemeral: true,
                });
            }
        } else {
            try {
                YTBsearch = await client.distube.search(music);
                addedSong = YTBsearch[0];
                await client.distube.playVoiceChannel(
                    channel,
                    YTBsearch[0].url,
                    { options: message.user }
                );
            } catch (e) {
                console.log(e);
                message.editReply({
                    embeds: [Embed.errorEmbed().setDescription(`${e}`)],
                    ephemeral: true,
                });
            }
        }

        try {
            message.editReply({
                embeds: [
                    Embed.musicEmbed()
                        .setTitle(
                            `▶️ | Une musique a été ajouté à la file d'attente : `
                        )
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
                        ),
                ],
                components: [ButtonRow.musicButtonRow(), ButtonRow.musicButtonRow2()],
                ephemeral: true,
            });
        } catch (e) {
            console.log(e);
            message.editReply({
                embeds: [Embed.errorEmbed().setDescription(`${e}`)],
                ephemeral: true,
            });
        }
    },
};
