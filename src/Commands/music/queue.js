const { errorEmbed, musicEmbed } from "../../util/Embeds");
const { musicButtonRow, musicButtonRow2 } from "../../util/buttonLayout");
const { SlashCommandBuilder } from "discord.js");

export default {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Affiche la file d'attente"),

    async execute(message, client) {
        try {
            const queue = client.distube.getQueue(message);
            if (!queue)
                return message.reply({
                    embeds: [
                        errorEmbed().setDescription(
                            `La file d'attente est actuellement vide !`
                        ),
                    ],
                    ephemeral: true,
                });

            const numberSongs = queue.songs.length;
            const previousNumberSongs = queue.previousSongs.length;
            const tracks = queue.songs.map(
                (song, i) =>
                    `**${i + previousNumberSongs}** - [${song.name}](${
                        song.url
                    }) - ${song.formattedDuration}`
            );
            const previousTracks = queue.previousSongs.map(
                (song, i) =>
                    `**${i}** - [${song.name}](${song.url}) - ${song.formattedDuration}`
            );

            const nextSongs = `**${previousNumberSongs}** musique(s) sur **${numberSongs}** de la playlist a(ont) été jouée(s)`;

            let playingEmbed = musicEmbed()
                .setDescription(
                    `${previousTracks
                        .slice(-6)
                        .join(
                            "\n"
                        )}\n⤵️  ⤵️  ⤵️  \n**${previousNumberSongs} Actuellement [${
                        queue.songs[0].name
                    }](${queue.songs[0].url})**\n⤴️  ⤴️  ⤴️  \n${tracks
                        .slice(1, 6)
                        .join("\n")}\n\n${nextSongs}`
                )
                .setThumbnail(queue.songs[0].thumbnail);

            message.reply({ embeds: [playingEmbed], ephemeral: true });
        } catch (e) {
            message.reply({
                embeds: [errorEmbed().setDescription(`${e}`)],
                ephemeral: true,
            });
        }
    },
};
