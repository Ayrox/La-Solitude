import { DisTube } from "distube";
import * as Embed from "../../Util/Embeds.js";
import * as ButtonRow from "../../Util/buttonLayout.js";
import config from "../../config.js";
import { generateProgressBar } from "../../Util/functions.js";

export const event = {
    name: "playSong",
    once: false,

    /**
     * @param {DisTube.Queue} queue
     * @param {DisTube.Song} song
     */
    async execute(queue, song) {
        if (!queue)
            return console.log("La file d'attente est actuellement vide !");
        console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_PLAY_SONG] [INFO] Now playing:`, song.name);
        console.log(
            `Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}`
        );

        const embed = Embed.musicEmbed()
            .setTitle(`Musique actuelle : ${song.name}`)
            .setURL(`${song.url}`)
            .setThumbnail(`${song.thumbnail}`)
            .setDescription(
                `**${queue.formattedCurrentTime} ${generateProgressBar(
                    queue.currentTime,
                    song.duration,
                    false
                )} ${song.formattedDuration}**`
            )
            .addFields(
                {
                    name: `Demandé par :`,
                    value: `${song.member}`,
                    inline: true
                },
                {
                    name: `Auteur :`,
                    value: `[${song.uploader.name}](${song.uploader.url})`,
                    inline: true
                },
                {
                    name: `Volume :`,
                    value: `${queue.volume}%`,
                    inline: true
                }
            );

        try {
            musicChannel = await queue.voiceChannel.guild.channels.cache
                .get(
                    (
                        await config(queue.voiceChannel.guild.id)
                    ).channel.MusicChannelID
                )
                .send({
                    embeds: [embed],
                    components: [ButtonRow.musicButtonRow(), ButtonRow.musicButtonRow2()],
                    ephemeral: false,
                });
        } catch (err) {
            //console.log(err)
            return console.log("Le channel musique n'est pas défini");
        }

        try {
            const ckeckPlayingSong = queue.songs[0];
            const songDurationMs = ckeckPlayingSong.duration * 1000; // Convertir en millisecondes
            
            var refreshMessage = setInterval(() => {
                if (!queue)
                    return console.log(
                        "La file d'attente est actuellement vide !"
                    );
                let playingSong = queue.songs[0];
                if (!playingSong) {
                    console.log("Mauvaise durée de la musique");
                    musicChannel.delete();
                    return clearInterval(refreshMessage);
                }
                if (ckeckPlayingSong.name != playingSong.name) {
                    musicChannel.delete();
                    return clearInterval(refreshMessage);
                }
                
                // Vérifier si la musique est terminée (temps actuel >= durée)
                if (queue.currentTime >= ckeckPlayingSong.duration) {
                    console.log("Musique terminée, arrêt de la mise à jour");
                    return clearInterval(refreshMessage);
                }
                
                musicChannel.edit({
                    embeds: [
                        Embed.musicEmbed()
                            .setTitle(`Musique actuelle : ${playingSong.name}`)
                            .setURL(`${playingSong.url}`)
                            .setThumbnail(`${playingSong.thumbnail}`)
                            .setDescription(
                                `**${
                                    queue.formattedCurrentTime
                                } ${generateProgressBar(
                                    queue.currentTime,
                                    playingSong.duration
                                )} ${playingSong.formattedDuration}**`
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
                    ephemeral: false,
                });
            }, 5000);
            
            // Arrêter automatiquement l'intervalle après la durée de la musique + 10 secondes de marge
            setTimeout(() => {
                console.log("Timeout atteint pour la durée de la musique, arrêt de la mise à jour");
                clearInterval(refreshMessage);
            }, songDurationMs + 10000);
            
        } catch (err) {
            console.log(err);
        }
    },
};
