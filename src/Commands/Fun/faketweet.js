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
        .setName("faketweet")
        .setDescription("Créer un faux tweet")
        .addStringOption((option) =>
            option
                .setName("tweet")
                .setDescription("Le contenu du tweet.")
                .setRequired(true)
        )
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("Le membre qui va tweeter")
                .setRequired(false)
        )
        .addBooleanOption((option) =>
            option
                .setName("verified")
                .setDescription("Compte vérifié ?")
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName("theme")
                .setDescription("Thème du tweet.")
                .setRequired(false)
                .addChoices(
                {
                     name: "light",
                     value: "light",
                },
                {
                    name: "dim",
                    value: "dim",
                },
                {
                    name: "dark",
                    value: "dark",
                },
            )
        )
        .addIntegerOption((option) =>
            option
                .setName("likes")
                .setDescription("Nombre de like")
                .setRequired(false)
        ).addIntegerOption((option) =>
            option
                .setName("retweets")
                .setDescription("Nombre de retweet")
                .setRequired(false)
        ).addIntegerOption((option) =>
            option
                .setName("replies")
                .setDescription("Nombre de réponse")
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

            let tweet = message.options.getString("tweet");
            let Target = message.options.getMember("user");
            
            let likes = message.options.getInteger("likes")
            let replies = message.options.getInteger("replies")
            let retweets = message.options.getInteger("retweets")
            
            let theme = message.options.getString("theme")
            let verified = message.options.getBoolean("verified")

            if (!Target) Target = message.member;

            const fetchAPI = async () => {
                const response = await fetch(
                    `https://some-random-api.ml/canvas/tweet?avatar=${Target.user.displayAvatarURL().replace(".webp",".png")
                    }&username=${Target.user.username
                    }&displayname=${Target.nickname ? Target.nickname : Target.user.username
                    }&comment=${tweet
                    }&likes=${likes
                    }&replies=${replies
                    }&retweets=${retweets
                    }&theme=${theme
                    }&verified=${verified}`,
                    {
                        method: "GET",
                    }
                );

                return await response;
            };

            const data = await fetchAPI();
            const attach = new AttachmentBuilder(data.body, {name: "img.png"});

            const embed = new EmbedBuilder()
                .setDescription(`**Tweet de ${Target}**`)
                .setColor("#00C5FF")
                .setImage(`attachment://img.png`)
                .setFooter({
                    text: `Demander par ${message.member.user.tag}`,
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
