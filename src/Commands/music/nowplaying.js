const { errorEmbed, musicEmbed } from "../../util/Embeds");
const { musicButtonRow, musicButtonRow2 } from "../../util/buttonLayout");
const { generateProgressBar } from "../../util/functions");
const { SlashCommandBuilder } from "discord.js");

export default {
    data: new SlashCommandBuilder()
        .setName("nowplaying")
        .setDescription("Affiche les informations de la musique en cours"),

    async execute(message, client) {
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
        const channel = message.member.voice.channel;
        if (!channel)
            return message.reply({
                embeds: [
                    errorEmbed().setDescription(
                        `Vous devez rejoindre le Bot en vocal !`
                    ),
                ],
                ephemeral: true,
            });

        try {
            message.deferReply({ ephemeral: false });
            var refreshTimout =
                queue.songs[0].duration - queue.songs[0].currentTime;
            var count = 0;
            var refreshMessage = setInterval(() => {
                count++;
                if (count > refreshTimout) {
                    clearInterval(refreshMessage);
                    message.delete();
                }
                let playingSong = queue.songs[0];
                //console.log(`${queue.formattedCurrentTime} **${generateProgressBar(queue.currentTime, playingSong.duration )}** ${playingSong.formattedDuration}`)
                message.editReply({
                    embeds: [
                        musicEmbed()
                            .setTitle(`Musique jouée : ${playingSong.name}`)
                            .setURL(`${playingSong.url}`)
                            .setThumbnail(`${playingSong.thumbnail}`)
                            .setDescription(
                                `**${
                                    queue.formattedCurrentTime
                                } ${generateProgressBar(
                                    queue.currentTime,
                                    playingSong.duration,
                                    false
                                )} ${playingSong.formattedDuration}**`
                            )
                            .addFields(
                                {
                                    name: `Demandé par :`,
                                    value: `${playingSong.user}`,
                                    inline: true
                                },
                                {
                                    name:`Auteur :`,
                                    value:`[${playingSong.uploader.name}](${playingSong.uploader.url})`,
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
                    ephemeral: false,
                });
            }, 1000);
        } catch (e) {
            message.editReply({
                embeds: [errorEmbed().setDescription(`${e}`)],
                ephemeral: true,
            });
        }
    },
};
