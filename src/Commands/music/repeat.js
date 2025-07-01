import * as Embed from "../../Util/Embeds.js";
import { SlashCommandBuilder } from "discord.js";

export const command = {
    data: new SlashCommandBuilder()
        .setName("repeat")
        .setDescription("Répète la musique en cours")
        .addStringOption((option) =>
            option
                .setName("mode")
                .setDescription(
                    "Choisissez un mode de répétition (Désactiver, Répéter la musique, Répéter la file d'attente)."
                )
                .setRequired(true)
                .addChoices(
                    { name: "Désactiver", value: "0" },
                    { name: "Répéter la musique", value: "1" },
                    { name: "Répéter la file d'attente", value: "2" }
                )
        ),

    async execute(message, client) {
        try {
            let mode = message.options.getInteger("mode");
            const queue = client.distube.getQueue(message);
            if (!queue)
                return message.reply({
                    embeds: [
                        Embed.errorEmbed().setDescription(
                            `Aucune musique n'est joué actuellement 😕 !`
                        ),
                    ],
                    ephemeral: true,
                });
            mode = queue.setRepeatMode(mode);
            mode = mode
                ? mode === 2
                    ? "Répétition de la file d'attente"
                    : "Répétition de la musique"
                : "Désactiver";

            message.reply({
                embeds: [
                    Embed.musicEmbed().setDescription(
                        `🔁 | ${message.user} a défini le mode de répétition sur \`${mode}\``
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
