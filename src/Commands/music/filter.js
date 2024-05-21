import * as Embed from "../../util/Embeds";
import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("filters")
        .setDescription("Applique des filtres à la musique")
        .addStringOption((option) =>
            option
                .setName("filtres")
                .setDescription("les filtres disponibles")
                .setRequired(true)
                .addChoices(
                    { name: "désactiver", value: "0" },
                    { name: "3d", value: "1" },
                    { name: "bassBoosted", value: "2" },
                    { name: "echo", value: "3" },
                    { name: "karaoké", value: "4" },
                    { name: "nightCore", value: "5" },
                    { name: "vaporWave", value: "6" },
                    { name: "flanger", value: "7" },
                    { name: "gate", value: "8" },
                    { name: "haas", value: "9" },
                    { name: "reverse", value: "10" },
                    { name: "surround", value: "11" },
                    { name: "mcompand", value: "12" },
                    { name: "phaser", value: "13" },
                    { name: "tremolo", value: "14" },
                    { name: "earwax", value: "15" }
                )
        ),

    async execute(message, client) {
        try {
            filterList = [
                false,
                "3d",
                "bassboost",
                "echo",
                "karaoke",
                "nightcore",
                "vaporwave",
                "flanger",
                "gate",
                "haas",
                "reverse",
                "surround",
                "mcompand",
                "phaser",
                "tremolo",
                "earwax",
            ];

            filterNumber = message.options.getInteger("filter");
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
            queue.setFilter(filterList[filterNumber]);

            message.reply({
                embeds: [
                    Embed.musicEmbed().setDescription(
                        `🔊 | ${message.user} a appliqué le filtre \`${
                            filterList[filterNumber] || "Désactiver"
                        }\` à la musique !`
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
