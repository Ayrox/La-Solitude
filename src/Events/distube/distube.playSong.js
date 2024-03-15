import { DisTube } from "distube";
import { errorEmbed, musicEmbed } from "../../util/Embeds.js";
import { musicButtonRow, musicButtonRow2 } from "../../util/buttonLayout.js";
import config from "../../config.js";
import { generateProgressBar } from "../../util/functions.js";

export default {
    name: "playSong",
    once: false,

    /**
     * @param {DisTube.Queue} queue
     * @param {DisTube.Song} song
     */
    async execute(queue, song) {
        if (!queue)
            return console.log("La file d'attente est actuellement vide !");
        console.log(
            `Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}`
        );

        const embed = musicEmbed()
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
                    components: [musicButtonRow(), musicButtonRow2()],
                    ephemeral: false,
                });
        } catch (err) {
            //console.log(err)
            return console.log("Le channel musique n'est pas défini");
        }

        try {
            const ckeckPlayingSong = queue.songs[0];
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
                musicChannel.edit({
                    embeds: [
                        musicEmbed()
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
                    components: [musicButtonRow(), musicButtonRow2()],
                    ephemeral: false,
                });
            }, 3000);
        } catch (err) {
            console.log(err);
        }
    },
};
