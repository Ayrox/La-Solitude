const { errorEmbed, musicEmbed } from "../../util/Embeds");
const { SlashCommandBuilder } from "discord.js");

export default {
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
            timeToSkip = message.options.getInteger("time");
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
            queue.seek(timeToSkip);

            message.reply({
                embeds: [
                    musicEmbed().setDescription(
                        `La musique a été avancée de ${timeToSkip} secondes par ${message.member}!`
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
