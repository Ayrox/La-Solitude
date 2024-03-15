const Discord from "discord.js");
 

export default {
    data: new Discord.SlashCommandBuilder()
        .setName("trepuecinfo")
        .setDescription(
            "Quelque informations à propos de Mr François Le Trepuec"
        ),

    async execute(message) {
        const trepuecAttach = new Discord.AttachmentBuilder(
            "./src/util/img/trepuec.jpg"
        );

        var trepuecembed = new Discord.EmbedBuilder()
            .setTitle("Le Trepuec")
            .setDescription(
                "Mr Le Trepuec est un professeur de Technologie dans le Lycée St Joseph La Salle à Lorient. L'émerveillement des lycéens à propos de ce professeur provient de son charisme à tout épreuve et de sa façon de parler indéniable. \n ** ATTENTION : cette personne pointe autant que TheKairi78**"
            )
            .setColor(0xff6800)
            .setImage("attachment://trepuec.jpg")
            .setTimestamp();

        await message.deferReply();

        await message
            .editReply({
                embeds: [{ description: "⏳ Chargement ...", color: 0xff6800 }],
            })
            .then(async (resultMessage) => {
                resultMessage.edit({
                    embeds: [trepuecembed],
                    files: [trepuecAttach],
                });
            });
    },
};
