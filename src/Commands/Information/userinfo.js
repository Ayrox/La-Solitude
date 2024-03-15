 
const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } from "discord.js");

export default {
    data: new ContextMenuCommandBuilder()
        .setName("userinfo")
        .setType(ApplicationCommandType.User),

    async execute(interaction) {
        const target = await interaction.guild.members.fetch(
            interaction.targetId
        );

        const userMessage = new EmbedBuilder()
            .setColor("Aqua")
            .setAuthor({
                name: target.user.tag,
                url: target.user.avatarURL({ dynamic: true, size: 512 })
            })
            .setThumbnail(target.user.avatarURL({ dynamic: true, size: 512 }))
            .setDescription(`Informations sur <@${target.id}>`)
            .addFields(
                {
                    name: "ID :",
                    value: `${target.user.id}`
                },
                {
                    name :"Rôles :",
                    value: `${
                        target.roles.cache
                            .map((r) => r)
                            .join(" ")
                            .replace("@everyone", "") || "`Rien`"
                        }`
                },
                {
                    name: "Membre depuis :",
                    value: `<t:${parseInt(target.joinedTimestamp / 1000)}:R>`,
                    inline: true
                },
                {
                    name: "Utilise Discord depuis :",
                    value: `<t:${parseInt(target.user.createdTimestamp / 1000)}:R>`,
                    inline: true
                }
            );

        interaction.reply({ embeds: [userMessage], ephemeral: true });
    },
};
