 
const Discord from "discord.js");

export default {
    data: new Discord.SlashCommandBuilder()
        .setName("serverinfo")
        .setDescription("Affiche les informations du serveur"),

    async execute(message) {
        let CreatedDate = message.guild.createdAt;
        let Joindate = message.member.joinedAt;

        let icon = message.guild.iconURL();

        let servemb = new Discord.EmbedBuilder()
            .setTitle(":clipboard: INFORMATION SUR LE SERVEUR :clipboard:")
            .setColor("#FF6800")
            .setThumbnail(icon)
            .addFields(
                {name : "Nom du Serveur : ",value: `${message.guild.name}`},
                {name: "Crée le : ", value: `<t:${parseInt(message.guild.createdAt / 1000)}:R>`},
                {name: "Propriétaire : ",value: `${await message.guild.fetchOwner()}`},
                {name: "Tu as rejoins le : ", value: `<t:${parseInt(message.member.joinedAt / 1000)}:R>`},
                {name: "Total des membres :",value: `${message.guild.memberCount} `}
            );

        return message.reply({ embeds: [servemb] });
    },
};
