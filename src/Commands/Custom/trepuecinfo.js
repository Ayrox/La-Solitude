import Discord from "discord.js";
 

export const command = {
    data: new Discord.SlashCommandBuilder()
        .setName("trepuecinfo")
        .setDescription(
            "Quelque informations à propos de Mr François Le Trepuec"
        ),

    async execute(message) {
        try {
            const trepuecAttach = new Discord.AttachmentBuilder(
                "./src/util/img/trepuec.jpg"
            );

            const trepuecembed = new Discord.EmbedBuilder()
                .setTitle("Le Trepuec")
                .setDescription(
                    "Mr Le Trepuec est un professeur de Technologie dans le Lycée St Joseph La Salle à Lorient. L'émerveillement des lycéens à propos de ce professeur provient de son charisme à tout épreuve et de sa façon de parler indéniable. \n ** ATTENTION : cette personne pointe autant que TheKairi78**"
                )
                .setColor(0xff6800)
                .setImage("attachment://trepuec.jpg")
                .setTimestamp();

            await message.deferReply();

            await message.editReply({
                embeds: [{ description: "⏳ Chargement ...", color: 0xff6800 }],
            });

            await message.editReply({
                embeds: [trepuecembed],
                files: [trepuecAttach],
            });
        } catch (error) {
            console.error(`[${new Date().toISOString()}] [COMMAND] [TREPUECINFO] [ERROR] Une erreur s'est produite dans la commande 'trepuecinfo' :`, error);
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
