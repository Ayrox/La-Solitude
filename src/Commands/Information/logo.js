import { AttachmentBuilder, EmbedBuilder, SlashCommandBuilder } from "discord.js";

export const command = {
    data: new SlashCommandBuilder()
        .setName("logo")
        .setDescription("Affiche le logo du serveur"),

    async execute(message, client) {
        try {
            let logoembed = new EmbedBuilder()
                .setTitle(`Le Logo de ${message.guild.name}`)
                .setColor(0xff6800)
                .setImage(message.guild.iconURL({ dynamic: true, format: "png" }))
                .setTimestamp();

            await message.deferReply();

            await message
                .editReply({
                    embeds: [{ description: "⏳ Chargement", color: 0xff6800 }],
                })
                .then(async (resultMessage) => {
                    resultMessage.edit({ embeds: [logoembed] });
                });
        } catch (error) {
            console.error("❌ Une erreur s'est produite dans la commande 'logo' :", error);
            await message.reply({
                embeds: [
                    {
                        description: "❌ Une erreur inattendue s'est produite. Veuillez réessayer plus tard.",
                        color: 0xff0000,
                    },
                ],
            });
        }
    },
};
