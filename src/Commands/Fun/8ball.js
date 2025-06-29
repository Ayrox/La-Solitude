import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

const answers = [
    "C'est certain.",
    "C'est le cas.",
    "Sans aucun doute.",
    "Définitivement, Oui.",
    "Tu peux compter dessus.",
    "Comme je le vois, oui.",
    "Très probablement.",
    "Les perspectives sont bonnes.",
    "Oui.",
    "Tout porte à croire que oui.",
    "Réponse floue, essayez à nouveau.",
    "Repose ta question plus tard.",
    "Il vaut mieux ne pas te le dire maintenant.",
    "Impossible de prédire maintenant.",
    "Concentrez-vous et demandez à nouveau.",
    "N'y comptez pas.",
    "Ma réponse est non.",
    "Mes sources me disent que non.",
    "Les perspectives ne sont pas très bonnes.",
    "Très douteux.",
    "Non.",
    "Certainement pas.",
    "Je ne suis pas sûr.",
    "Pas du tout.",
    "Niet.",
    "Ta gueule, fils de pute !!!",
    "Pas d'avis.",
    "C'est ton destin.",
    "Oui absolument.",
    "C'est bien parti",
    "Faut pas rêver",
];

export const command = {
    data: new SlashCommandBuilder()
        .setName("8ball")
        .setDescription("Je répond à vos questions")
        .addStringOption((option) =>
            option
                .setName("question")
                .setDescription("Écris ta question")
                .setRequired(true)
        ),

    async execute(message) {
        try {
            const question = message.options.getString("question");

            const embed = new EmbedBuilder()
                .setTitle("🎱  The Magic 8-Ball  🎱")
                //.setDescription("**-----------------------------**")
                .addFields({name: "Question", value: `\`${question}\``},
                {
                    name: "Réponse",
                    value: `\`${answers[Math.floor(Math.random() * answers.length)]}\``
                })
                .setTimestamp()
                .setColor("#6f00ff");

            await message.reply({ embeds: [embed] });
        } catch (error) {
            console.error("❌ Une erreur s'est produite dans la commande '8ball' :", error);
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
