const { errorEmbed, musicEmbed } from "../../util/Embeds");
const { SlashCommandBuilder } from "discord.js");

export default {
    data: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("Mélange les musiques de la file d'attente"),

    async execute(message, client) {
        try {
            const queue = client.distube.getQueue(message);
            if (!queue)
                return message.reply({
                    embeds: [
                        errorEmbed().setDescription(
                            `La file d'attente est actuellement vide !`
                        ),
                    ],
                    ephemeral: true,
                });
            queue.shuffle();

            message.reply({
                embeds: [
                    musicEmbed().setDescription(
                        `🔀 | ${message.user} a mélangé les musiques de la file d'attente...`
                    ),
                ],
            });
        } catch (e) {
            message.reply({
                embeds: [errorEmbed().setDescription(`${e}`)],
                ephemeral: true,
            });
        }
    },
};
