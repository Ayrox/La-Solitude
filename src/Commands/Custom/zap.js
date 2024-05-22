import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
 

export const command = {
    data: new SlashCommandBuilder().setName("zap").setDescription("Euuuuh...."),

    async execute(message) {
        let client = message.client
        var Kwey = await client.users.fetch("232110364186247168");

        message.reply({
            embeds: [
                {
                    color: 0xff6800,
                    title: "**Chignon = Pneu**",
                    description: "",
                    footer: {
                        icon_url: Kwey.avatarURL(),
                        text: "© Created by Kweyy",
                    },
                },
            ],
        });
    },
};
