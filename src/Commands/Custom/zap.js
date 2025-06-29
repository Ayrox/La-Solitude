import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export const command = {
    data: new SlashCommandBuilder().setName("zap").setDescription("Euuuuh...."),

    async execute(message) {
        try {
            let client = message.client;
            var Kwey = await client.users.fetch("232110364186247168");

            const embed = new EmbedBuilder()
                .setColor(0xff6800)
                .setTitle("**Chignon = Pneu**")
                .setFooter({
                    iconURL: Kwey.avatarURL(),
                    text: "© Created by Kweyy",
                });

            await message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(`[${new Date().toISOString()}] [COMMAND] [ZAP] [ERROR] Une erreur s'est produite dans la commande 'zap' :`, error);
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
