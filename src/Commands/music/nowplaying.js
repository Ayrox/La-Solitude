import * as Embed from "../../util/Embeds.js";
import * as ButtonRow from "../../util/buttonLayout.js";
import { generateProgressBar, safeThumbnail } from "../../util/functions.js";
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
                    return;
                }
                
                // Vérifier si la queue existe toujours
                const currentQueue = client.distube.getQueue(message);
                if (!currentQueue || !currentQueue.songs || !currentQueue.songs[0]) {
                    console.log(`[${new Date().toISOString()}] [COMMAND] [NOWPLAYING] [INFO] Queue supprimée, arrêt du refresh`);
                    clearInterval(refreshMessage);
                    return;
                }
                
                let playingSong = currentQueue.songs[0];
                console.log(`[${new Date().toISOString()}] [COMMAND] [NOWPLAYING] [INFO] Commande 'nowplaying' exécutée. Musique en cours : ${playingSong.name}`);
                
                // Créer l'embed de manière sécurisée
                const nowPlayingEmbed = Embed.musicEmbed()
                    .setTitle(`Musique jouée : ${playingSong.name}`)
                    .setURL(`${playingSong.url}`)
                    .setDescription(
                        `**${
                            currentQueue.formattedCurrentTime
                        } ${generateProgressBar(
                            currentQueue.currentTime,
                            playingSong.duration,
                            false
                        )} ${playingSong.formattedDuration}**`
                    );
                
                // Ajouter la miniature de manière sécurisée
                safeThumbnail(nowPlayingEmbed, playingSong.thumbnail);
                
                // Ajouter les champs
                nowPlayingEmbed.addFields(
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
                        value: `${currentQueue.volume}%`,
                        inline: true
                    }
                );
                
                message.editReply({
                    embeds: [nowPlayingEmbed],
                    components: [ButtonRow.musicButtonRow(), ButtonRow.musicButtonRow2()]
                }).catch(error => {
                    console.error(`[NOWPLAYING] Erreur lors de la mise à jour:`, error);
                    clearInterval(refreshMessage);
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
