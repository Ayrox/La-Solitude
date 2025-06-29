import { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } from "discord.js";

export const command = {
    data: new ContextMenuCommandBuilder()
        .setName("avatar")
        .setType(ApplicationCommandType.User),

    async execute(interaction) {
        try {
            const target = await interaction.guild.members.fetch(
                interaction.targetId
            );

            const userMessage = new EmbedBuilder()
                .setAuthor({
                    name: "Avatar de " + target.user.tag,
                    url: target.user.displayAvatarURL({ format: "png" })
                })
                .setImage(target.user.avatarURL({ dynamic: true, format: "png" }))
                .setTimestamp();

            interaction.reply({ embeds: [userMessage], ephemeral: true });
        } catch (error) {
            console.error(`[${new Date().toISOString()}] [COMMAND] [AVATAR] [ERROR] Une erreur s'est produite dans la commande 'avatar' :`, error);
            await interaction.reply({
                embeds: [
                    {
                        description: "❌ Une erreur inattendue s'est produite. Veuillez réessayer plus tard.",
                        color: 0xff0000,
                    },
                ],
                ephemeral: true,
            });
        }
    },
};
