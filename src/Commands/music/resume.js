import * as Embed from "../../Util/Embeds.js";
import { SlashCommandBuilder } from "discord.js";

export const command = {
    data: new SlashCommandBuilder()
        .setName("resume")
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
                return message.reply({
                    embeds: [
                        Embed.musicEmbed().setDescription(
                            `${message.user} a repris la lecture de la musique en cours...`
                        ),
                    ],
                });
            }
            queue.pause();

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
