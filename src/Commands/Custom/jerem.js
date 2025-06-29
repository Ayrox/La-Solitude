import { EmbedBuilder, SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";


export const command = {
    data: new SlashCommandBuilder()
        .setName("jerem")
        .setDescription("Fait spawn un jérémie sauvage"),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        // Stub: reply with a simple embed placeholder
        const embed = new EmbedBuilder()
            .setTitle('Jérémie sauvage')
            .setDescription('Un Jérémie sauvage apparaît !')
            .setColor(0xff6800);
        await interaction.reply({ embeds: [embed] });
    },
};
