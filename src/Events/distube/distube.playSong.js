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
        
        // Méthode améliorée pour détecter l'autoplay
        const isAutoplayAddition = song._isAutoplayAddition === true || (!song.member && !song.user);
        console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_PLAY_SONG] [INFO] Now playing: ${song.name}`);
        console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_PLAY_SONG] [DEBUG] Added by autoplay: ${isAutoplayAddition ? 'YES' : 'NO'}`);
        console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_PLAY_SONG] [DEBUG] Song._isAutoplayAddition: ${song._isAutoplayAddition}`);
        console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_PLAY_SONG] [DEBUG] Queue songs: ${queue.songs.length}`);

        const embed = Embed.musicEmbed()
            .setTitle(`${isAutoplayAddition ? '🎵 Autoplay: ' : ''}Musique actuelle : ${song.name}`)
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
                    value: `${song.member || '🤖 Autoplay'}`,
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

        // Si c'est une chanson d'autoplay, ajouter une indication visuelle
        if (isAutoplayAddition) {
            embed.setColor(0x00ff88); // Couleur différente pour l'autoplay
            embed.setFooter({ text: "🎵 Ajoutée automatiquement par l'autoplay" });
        }

        let musicChannel;

        try {
            // Supprimer l'ancien message de lecteur s'il existe
            if (queue.lastPlayerMessage) {
                try {
                    await queue.lastPlayerMessage.delete();
                    console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_PLAY_SONG] [DEBUG] Ancien message de lecteur supprimé`);
                } catch (err) {
                    console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_PLAY_SONG] [DEBUG] Impossible de supprimer l'ancien message:`, err.message);
                }
            }

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
            
            // Stocker le nouveau message comme le lecteur actuel
            queue.lastPlayerMessage = musicChannel;
            console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_PLAY_SONG] [DEBUG] Nouveau message de lecteur créé et stocké`);
            
        } catch (err) {
            //console.log(err)
            return console.log("Le channel musique n'est pas défini");
        }

        try {
            // Arrêter l'ancien intervalle s'il existe
            if (queue.progressUpdateInterval) {
                clearInterval(queue.progressUpdateInterval);
                console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_PLAY_SONG] [DEBUG] Ancien intervalle de mise à jour arrêté`);
            }

            const checkPlayingSong = queue.songs[0];
            const songDurationMs = checkPlayingSong.duration * 1000; // Convertir en millisecondes
            
            // Stocker l'état d'autoplay pour cette chanson spécifique
            queue.currentSongIsAutoplay = isAutoplayAddition;
            console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_PLAY_SONG] [DEBUG] Autoplay status stored: ${isAutoplayAddition}`);
            
            queue.progressUpdateInterval = setInterval(() => {
                if (!queue || !queue.lastPlayerMessage) {
                    console.log("Queue ou message de lecteur manquant, arrêt de la mise à jour");
                    return clearInterval(queue.progressUpdateInterval);
                }
                
                let playingSong = queue.songs[0];
                if (!playingSong) {
                    console.log("Mauvaise durée de la musique");
                    try {
                        queue.lastPlayerMessage.delete();
                    } catch (err) {}
                    return clearInterval(queue.progressUpdateInterval);
                }
                
                if (checkPlayingSong.name != playingSong.name) {
                    console.log("Chanson changée, arrêt de la mise à jour de l'ancienne");
                    return clearInterval(queue.progressUpdateInterval);
                }
                
                // Vérifier si la musique est terminée (temps actuel >= durée)
                if (queue.currentTime >= checkPlayingSong.duration) {
                    console.log("Musique terminée, arrêt de la mise à jour");
                    return clearInterval(queue.progressUpdateInterval);
                }
                
                queue.lastPlayerMessage.edit({
                    embeds: [
                        Embed.musicEmbed()
                            .setTitle(`${queue.currentSongIsAutoplay ? '🎵 Autoplay: ' : ''}Musique actuelle : ${playingSong.name}`)
                            .setURL(`${playingSong.url}`)
                            .setThumbnail(`${playingSong.thumbnail}`)
                            .setDescription(
                                `**${
                                    queue.formattedCurrentTime
                                } ${generateProgressBar(
                                    queue.currentTime,
                                    playingSong.duration,
                                    queue.paused
                                )} ${playingSong.formattedDuration}**`
                            )
                            .addFields(
                                {
                                    name: `Demandé par :`,
                                    value: `${playingSong.member || playingSong.user || '🤖 Autoplay'}`,
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
                            )
                            .setColor(queue.currentSongIsAutoplay ? 0x00ff88 : null)
                            .setFooter(queue.currentSongIsAutoplay ? { text: "🎵 Ajoutée automatiquement par l'autoplay" } : null),
                    ],
                    components: [ButtonRow.musicButtonRow(), ButtonRow.musicButtonRow2()],
                    ephemeral: false,
                }).catch((error) => {
                    console.log("Erreur lors de la mise à jour du lecteur:", error.message);
                    clearInterval(queue.progressUpdateInterval);
                });
            }, 5000);
            
            // Arrêter automatiquement l'intervalle après la durée de la musique + 10 secondes de marge
            setTimeout(() => {
                console.log("Timeout atteint pour la durée de la musique, arrêt de la mise à jour");
                if (queue.progressUpdateInterval) {
                    clearInterval(queue.progressUpdateInterval);
                }
            }, songDurationMs + 10000);
            
        } catch (err) {
            console.log(err);
        }
    },
};
