const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("avatar")
        .setType(ApplicationCommandType.User),

    async execute(interaction) {
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
    },
};
