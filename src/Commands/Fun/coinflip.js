import { EmbedBuilder, AttachmentBuilder, SlashCommandBuilder } from "discord.js";

export const command = {
    data: new SlashCommandBuilder()
        .setName("coinflip")
        .setDescription("Joue à pile ou face"),

    async execute(message) {
        try {
            const outcomes = ["Pile", "Face"];
            const result = outcomes[Math.floor(Math.random() * outcomes.length)];

            const embed = new EmbedBuilder()
                .setTitle("Pile ou Face")
                .setDescription(`Le résultat est : **${result}**`)
                .setColor(0x00ff00)
                .setTimestamp();

            await message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(`[${new Date().toISOString()}] [COMMAND] [COINFLIP] [ERROR] Une erreur s'est produite dans la commande 'coinflip' :`, error);
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
