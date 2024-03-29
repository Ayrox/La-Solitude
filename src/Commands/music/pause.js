const { errorEmbed, musicEmbed } = require("../../util/Embeds");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
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
                        errorEmbed().setDescription(
                            `La file d'attente est actuellement vide !`
                        ),
                    ],
                    ephemeral: true,
                });
            if (queue.paused) {
                queue.resume();
                return message.reply({
                    embeds: [
                        musicEmbed().setDescription(
                            `${message.user} a repris la lecture de la musique en cours...`
                        ),
                    ],
                });
            }
            queue.pause();

            message.reply({
                embeds: [
                    musicEmbed().setDescription(
                        `${message.user} a mis en pause la musique en cours...`
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
