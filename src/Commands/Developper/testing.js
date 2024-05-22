import { SlashCommandBuilder } from "discord.js";

export const command = {
    data: new SlashCommandBuilder()
        .setName("testing")
        .setDescription("testing"),

    execute(message, client) {
        if (message.member.id !== "206905331366756353")
            return message.reply({
                embed: [
                    Embed.errorEmbed().setDescription(
                        "Vous devez être le propriétaire du Bot pour utiliser cette commande !"
                    ),
                ],
            });

        client.emit("guildMemberAdd", message.member);
        //client.emit("guildMemberRemove", message.member)
    },
};
