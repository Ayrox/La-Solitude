import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export const command = {
    data: new SlashCommandBuilder()
        .setName("roll")
        .setDescription("Lancer un dé")
        .addIntegerOption((option) =>
            option
                .setName("sides")
                .setDescription(`Le nombre de faces du dé (par défaut: 6)`)
                .setRequired(false)
                .setMinValue(2)
                .setMaxValue(100)
        ),

    async execute(interaction) {
        try {
            await interaction.deferReply();
            
            let sides = interaction.options.getInteger("sides");
            if (sides == null) sides = 6;
            const roll = Math.floor(Math.random() * sides) + 1;
            const embed = new EmbedBuilder()
                .setColor("#FF0000")
                .setAuthor({
                    name: "🎲 Lance un dé",
                    iconURL: "https://upload.wikimedia.org/wikipedia/commons/5/53/Six_sided_dice.png"
                })
                .setDescription(
                    `${interaction.user} lance un dé à **${sides} faces**.`
                )
                .setFields(
                    { name: "--- Résultat ---", value: `**${roll}**`, inline: true }
                )
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Error in roll command:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setTitle("❌ Erreur")
                .setDescription("Une erreur s'est produite lors du lancement du dé.")
                .setColor(0xFF0000);
            
            if (interaction.replied || interaction.deferred) {
                await interaction.editReply({embeds: [errorEmbed]});
            } else {
                await interaction.reply({embeds: [errorEmbed], ephemeral: true});
            }
        }
    },
};
