import * as Embed from "../../util/Embeds.js";
import { SlashCommandBuilder } from "discord.js";

export const command = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription(
            "Met en pause ou Reprends la lecture d'une musique en cours"
        ),

    async execute(message, client) {
        try {
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
            if (queue.paused) {
                queue.resume();
                console.log(`[${new Date().toISOString()}] [COMMAND] [PAUSE] [INFO] Commande 'pause' exécutée. État : Reprise`);
                return message.reply({
                    embeds: [
                        Embed.musicEmbed().setDescription(
                            `${message.user} a repris la lecture de la musique en cours...`
                        ),
                    ],
                });
            }
            queue.pause();
            console.log(`[${new Date().toISOString()}] [COMMAND] [PAUSE] [INFO] Commande 'pause' exécutée. État : Pause`);

            message.reply({
                embeds: [
                    Embed.musicEmbed().setDescription(
                        `${message.user} a mis en pause la musique en cours...`
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
