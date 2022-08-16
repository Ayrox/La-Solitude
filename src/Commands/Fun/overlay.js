const { errorEmbed } = require("../../util/Embeds");
const { SlashCommandBuilder } = require("@discordjs/builders");
const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args)); // eslint-disable-line
const {
    EmbedBuilder,
    CommandInteraction,
    Client,
    AttachmentBuilder,
} = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("overlay")
        .setDescription("Ajoute un overlay sur ton avatar")
        .addStringOption(option =>
            option.setName('overlay')
                .setDescription('L\'overlay que tu veux ajouter')
                .setRequired(true)
                .addChoices(
                    {
                         name: "Gay",
                         value: "gay",
                     },
                     {
                         name: "Vitre",
                         value: "glass",
                     },
                     {
                         name: "GTA : Wasted",
                         value: "wasted",
                     },
                     {
                         name: "GTA : Mission Passed",
                         value: "passed",
                     },
                     {
                         name: "En prison",
                         value: "jail",
                     },
                     {
                         name: "Mon Camarade",
                         value: "comrade",
                     },
                     {
                         name: "Triggered",
                         value: "triggered",
                     },
                     {
                         name: "Carte Simp",
                         value: "simpcard",
                     },
                     {
                         name: "Horny",
                         value: "horny",
                     },
                     {
                         name: "Flouté",
                         value: "blur",
                     },
                     {
                         name: "Pixéliser",
                         value: "pixelate",
                     },
                )
        )
        .addUserOption(option => 
            option.setName('user')
                .setDescription('La personne à qui l\'overlay sera appliqué')
                .setRequired(false)

        ),


    /**
     *
     * @param {CommandInteraction} message
     * @param {Client} client
     */

    async execute(message, client) {
        try {
            await message.deferReply().catch(() => {});

            let overlay = message.options.getString("overlay");
            let Target = message.options.getMember("user");

            if (!Target) Target = message.member;

            const fetchAPI = async () => {
                const response = await fetch(
                    `https://some-random-api.ml/canvas/${overlay}?avatar=${Target.displayAvatarURL(
                        { format: "png" }
                    )}`,
                    {
                        method: "GET",
                    }
                );
                return await response;
            };

            const data = await fetchAPI();

            const attach = new AttachmentBuilder(data.body, "img.png");

            const embed = new EmbedBuilder()
                .setDescription(
                    `**L'avatar de ${Target} avec l'overlay \`${overlay}\` **`
                )
                .setColor("WHITE")
                .setImage(`attachment://img.png`)
                .setFooter({
                    text: `Demander par ${message.member.user.tag}`,
                    iconURL: message.member.displayAvatarURL()
                }
                )
                .setTimestamp();

            await message.editReply({ embeds: [embed], files: [attach] });
        } catch (err) {
            console.log(err);
            return message.editReply({
                embeds: [
                    errorEmbed().setDescription(`Une erreur est survenue`),
                ],
                ephemeral: true,
            });
        }
    },
};
