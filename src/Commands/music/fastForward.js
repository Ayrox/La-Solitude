import * as Embed from "../../Util/Embeds.js";
import { SlashCommandBuilder } from "discord.js";

export const command = {
    //! la commande fonctionne pour des petits nombre mais pas pour les grand (genre 300secondes)
    data: new SlashCommandBuilder()
        .setName("fastforward")
        .setDescription("Avance la musique d'un certain nombre de secondes")
        .addIntegerOption((option) =>
            option
                .setName("secondes")
                .setDescription("le nombre de secondes à avancer")
                .setRequired(true)
        ),

    async execute(message, client) {
        try {
            const timeToSkip = message.options.getInteger("secondes");
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
            queue.seek(timeToSkip);

            console.log(`[${new Date().toISOString()}] [COMMAND] [FASTFORWARD] [INFO] Commande 'fastforward' exécutée. Avancé de : ${timeToSkip} secondes.`);

            message.reply({
                embeds: [
                    Embed.musicEmbed().setDescription(
                        `La musique a été avancée de ${timeToSkip} secondes par ${message.member}!`
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
