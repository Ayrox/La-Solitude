import * as Embed from "../../Util/Embeds.js";
import * as ButtonRow from "../../util/buttonLayout.js";
import { generateProgressBar } from "../../util/functions.js";
import { SlashCommandBuilder } from "discord.js";

export const command = {
    data: new SlashCommandBuilder()
        .setName("nowplaying")
        .setDescription("Affiche les informations de la musique en cours"),

    async execute(message, client) {
        const queue = client.distube.getQueue(message);
        if (!queue)
            return message.reply({
                embeds: [
                    Embed.errorEmbed().setDescription(
                        `La file d'attente est actuellement vide !`
                    ),
                ],
                ephemeral: true,
            });
        const channel = message.member.voice.channel;
        if (!channel)
            return message.reply({
                embeds: [
                    Embed.errorEmbed().setDescription(
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
                console.log(`[${new Date().toISOString()}] [COMMAND] [NOWPLAYING] [INFO] Commande 'nowplaying' exécutée. Musique en cours : ${queue.songs[0].name}`);
                //console.log(`${queue.formattedCurrentTime} **${generateProgressBar(queue.currentTime, playingSong.duration )}** ${playingSong.formattedDuration}`)
                message.editReply({
                    embeds: [
                        Embed.musicEmbed()
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
                    components: [ButtonRow.musicButtonRow(), ButtonRow.musicButtonRow2()],
                    ephemeral: false,
                });
            }, 1000);
        } catch (e) {
            message.editReply({
                embeds: [Embed.errorEmbed().setDescription(`${e}`)],
                ephemeral: true,
            });
        }
    },
};
