const { errorEmbed } from "../../util/Embeds");
const { SlashCommandBuilder } from "discord.js");

const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args)); // eslint-disable-line
const {
    EmbedBuilder,
    CommandInteraction,
    Client,
    AttachmentBuilder,
} from "discord.js");

export default {
    data: new SlashCommandBuilder()
        .setName("fakecomment")
        .setDescription("Créer un faux commentaire Youtube")
        .addStringOption((option) =>
            option
                .setName("comment")
                .setDescription("Que voulez-vous commenter sur Youtube ?")
                .setRequired(true)
        )
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("Le membre qui va commenter.")
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

            let comment = message.options.getString("comment");
            let Target = message.options.getMember("user");

            if (!Target) Target = message.member;

            const fetchAPI = async () => {
                const response = await fetch(
                    `https://some-random-api.ml/canvas/youtube-comment?avatar=${Target.displayAvatarURL().replace(".webp",".png")
                    }&username=${Target.user.username}&comment=${comment}`,
                    {
                        method: "GET",
                    }
                );
                return await response;
            };

            const data = await fetchAPI();

            const attach = new AttachmentBuilder(data.body, { name: "img.png" });

            const embed = new EmbedBuilder()
                .setDescription(`**Le commentaire Youtube de ${Target}**`)
                .setColor("Red")
                .setImage(`attachment://img.png`)
                .setFooter({
                    text:`Requested by ${message.member.user.tag}`,
                    iconURL: message.member.displayAvatarURL()
                })
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
