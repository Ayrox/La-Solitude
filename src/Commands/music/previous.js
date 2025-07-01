import * as Embed from "../../Util/Embeds.js";
import { SlashCommandBuilder } from "discord.js";

export const command = {
    data: new SlashCommandBuilder()
        .setName("previous")
        .setDescription("Rejoue la musique précédente"),

    async execute(message, client) {
        const queue = client.distube.getQueue(message);
        const previousSong =
            queue.previousSongs[queue.previousSongs.length - 1];
        if (!queue)
            return message.reply({
                embeds: [
                    Embed.errorEmbed().setDescription(
                        `La file d'attente est actuellement vide !`
                    ),
                ],
                ephemeral: true,
            });
        if (previousSong === undefined)
            return message.reply({
                embeds: [
                    Embed.errorEmbed().setDescription(
                        `Rien n'a été joué précédement !`
                    ),
                ],
                ephemeral: true,
            });
        try {
            queue.previous();

            message.reply({
                embeds: [
                    Embed.musicEmbed()
                        .setThumbnail(`${previousSong.thumbnail}`)
                        .setDescription(
                            `Le son a été passé par ${message.user}! Musique actuelle :\n [${previousSong.name}](${previousSong.url})`
                        ),
                ],
            });
        } catch (e) {
            message.reply({
                embeds: [Embed.errorEmbed().setDescription(`${e}`)],
                ephemeral: true,
            });
        }
    },
};
