 
const { AttachmentBuilder, EmbedBuilder, SlashCommandBuilder } from "discord.js");

export default {
    data: new SlashCommandBuilder()
        .setName("logo")
        .setDescription("Affiche le logo du serveur"),

    async execute(message, client) {
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
    },
};
