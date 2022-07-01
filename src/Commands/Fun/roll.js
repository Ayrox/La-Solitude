const { MessageEmbed } = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("roll")
        .setDescription("Lancer un dé")
        .addIntegerOption((option) =>
            option
                .setName("dice")
                .setDescription(`Le nombre du dé que tu veux lancer`)
                .setRequired(false)
        ),

    async execute(message) {
        try {
            let dice = message.options.getString("dice");
            if (dice == null) dice = "6";
            const roll = Math.floor(Math.random() * dice) + 1;
            const embed = new MessageEmbed()
                .setColor("#FF0000")
                .setAuthor(
                    "Lance un dé",
                    "https://upload.wikimedia.org/wikipedia/commons/5/53/Six_sided_dice.png"
                )
                .setDescription(
                    `${message.user} lance un dé : ${roll} (0-${dice})`
                );

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.log(error);
            message.reply({
                embeds: [errorEmbed().setDescription(`${error}`)],
                ephemeral: true,
            });
        }
    },
};
