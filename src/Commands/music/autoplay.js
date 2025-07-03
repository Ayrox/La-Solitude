import * as Embed from "../../util/Embeds.js";
import { SlashCommandBuilder } from "discord.js";

export const command = {
    data: new SlashCommandBuilder()
        .setName("autoplay")
        .setDescription(
            "Si activé, le Bot jouera une musique recommandée par Youtube quand la file d'attente sera vide"
        ),

    async execute(message, client) {
        try {
            const queue = client.distube.getQueue(message);
            if (!queue)
                return message.reply({
                    embeds: [
                        Embed.errorEmbed().setDescription(
                            `La file d'attente est actuellement vide ! Lancez d'abord une musique avec /play`
                        ),
                    ],
                    ephemeral: true,
                });
            
            const autoplay = queue.toggleAutoplay();
            
            // Log pour debug
            console.log(`[${new Date().toISOString()}] [COMMAND] [AUTOPLAY] [INFO] Autoplay défini sur : ${autoplay ? 'On' : 'Off'}`);
            console.log(`[${new Date().toISOString()}] [COMMAND] [AUTOPLAY] [DEBUG] Queue autoplay status:`, queue.autoplay);
            console.log(`[${new Date().toISOString()}] [COMMAND] [AUTOPLAY] [DEBUG] Songs in queue:`, queue.songs.length);
            
            // Vérifier si la musique actuelle est de Spotify
            const currentSong = queue.songs[0];
            const isSpotifyTrack = currentSong && (
                currentSong.url.includes('spotify.com') || 
                currentSong.source === 'spotify' ||
                currentSong.metadata?.source === 'spotify'
            );

            let infoText = autoplay 
                ? "L'autoplay est maintenant **activé**. Des musiques recommandées seront automatiquement ajoutées quand la file d'attente sera vide."
                : "L'autoplay est maintenant **désactivé**. Aucune musique ne sera ajoutée automatiquement.";

            if (autoplay && isSpotifyTrack) {
                infoText += "\n\n⚠️ **Note Spotify**: L'autoplay fonctionne moins bien avec les pistes Spotify car il utilise l'algorithme de recommandation YouTube.";
            }

            message.reply({
                embeds: [
                    Embed.musicEmbed()
                        .setDescription(
                            `♻️ | ${message.user} a défini l'autoplay sur \`${
                                autoplay ? "On" : "Off"
                            }\``
                        )
                        .addFields({
                            name: "ℹ️ Information",
                            value: infoText,
                            inline: false
                        })
                ],
                ephemeral: true
            });
            
        } catch (e) {
            console.log(`[${new Date().toISOString()}] [COMMAND] [AUTOPLAY] [ERROR] Erreur:`, e);
            message.reply({
                embeds: [Embed.errorEmbed().setDescription(`❌ Erreur lors de la configuration de l'autoplay: ${e.message}`)],
                ephemeral: true,
            });
        }
    },
};
