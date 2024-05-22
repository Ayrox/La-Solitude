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
                            `La file d'attente est actuellement vide !`
                        ),
                    ],
                    ephemeral: true,
                });
            const autoplay = queue.toggleAutoplay();
            message.reply({
                embeds: [
                    Embed.musicEmbed().setDescription(
                        `♻️ | ${message.user} a défini l'autoplay sur \`${
                            autoplay ? "On" : "Off"
                        }\``
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
