const { errorEmbed, musicEmbed } from "../../util/Embeds");
const { SlashCommandBuilder } from "discord.js");

export default {
    data: new SlashCommandBuilder()
        .setName("volume")
        .setDescription("Change le volume de la musique")
        .addIntegerOption((option) =>
            option
                .setName("pourcentage")
                .setDescription("Par défaut, le volume est à 50%")
                .setRequired(true)
        ),

    name: "volume",
    description: "Change le volume de la musique",
    permission: "ADMINISTRATOR",
    active: true,

    options: [
        {
            name: "value",
            description: `Par défaut, le volume est à 50%`,
            type: 4,
            required: true,
        },
    ],

    async execute(message, client) {
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
        try {
            const volume = message.options.getInteger("value");
            if (isNaN(volume))
                return message.reply({
                    embeds: [
                        errorEmbed().setDescription(
                            `Vous devez rentrer un nombre valide`
                        ),
                    ],
                    ephemeral: true,
                });
            queue.setVolume(volume);

            message.reply({
                embeds: [
                    musicEmbed().setDescription(
                        `${message.user} a défini le volume à \`${volume}%\``
                    ),
                ],
            });
        } catch (e) {
            console.log(e);
            message.reply({
                embeds: [errorEmbed().setDescription(`${e}`)],
                ephemeral: true,
            });
        }
    },
};
