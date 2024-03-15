const { errorEmbed, musicEmbed } from "../../util/Embeds");
const { SlashCommandBuilder } from "discord.js");

export default {
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
            mode = message.options.getInteger("mode");
            const queue = client.distube.getQueue(message);
            if (!queue)
                return message.reply({
                    embeds: [
                        errorEmbed().setDescription(
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
                    musicEmbed().setDescription(
                        `🔁 | ${message.user} a défini le mode de répétition sur \`${mode}\``
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
