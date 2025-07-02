import * as Embed from "../../util/Embeds.js";
import { SlashCommandBuilder } from "discord.js";

export const command = {
    data: new SlashCommandBuilder()
        .setName("lyrics")
        .setDescription("Affiche les paroles de la musique en cours"),

    async execute(message, client) {
        console.log(`[${new Date().toISOString()}] [COMMAND] [LYRICS] [INFO] Commande 'lyrics' exécutée.`);
        try {
            const queue = client.distube.getQueue(message);
            if (!queue) {
                return message.reply({
                    embeds: [
                        Embed.errorEmbed().setDescription(
                            `La file d'attente est actuellement vide !`
                        ),
                    ],
                    ephemeral: true,
                });
            }

            // Fonctionnalité temporairement désactivée - nécessite une API de paroles
            return message.reply({
                embeds: [
                    Embed.errorEmbed().setDescription(
                        `🎵 Paroles pour: **${queue.songs[0].name}**\n\n⚠️ Cette fonctionnalité est temporairement indisponible.\nVeuillez rechercher les paroles manuellement.`
                    ),
                ],
                ephemeral: true,
            });

            //! TODO: Implémenter avec une API de paroles (Genius API, etc.)
        } catch (error) {
            console.error(`[${new Date().toISOString()}] [COMMAND] [LYRICS] [ERROR] Erreur lors de l'exécution de la commande lyrics :`, error);
            await message.reply({
                embeds: [
                    Embed.errorEmbed().setDescription(
                        `Une erreur s'est produite lors de la récupération des paroles.`
                    ),
                ],
                ephemeral: true,
            });
        }
    },
};
