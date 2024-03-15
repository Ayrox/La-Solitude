const { EmbedBuilder, SlashCommandBuilder } from "discord.js");
 
const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));
const delay from "delay");
const { errorEmbed } from "../../util/Embeds");

const MAX_MEME = 5;

export default {
    data: new SlashCommandBuilder()
        .setName("meme")
        .setDescription("Renvoie un meme")
        .addNumberOption((option) =>
            option
                .setName("combien")
                .setDescription(
                    `Combien de meme voulez-vous ? | Maximum : ${MAX_MEME}`
                )
                .setRequired(false)
        ),

    async execute(message) {
        let memeNumber =
            message.options.getNumber("combien") === null
                ? 1
                : Math.floor(message.options.getNumber("combien"));

        if (memeNumber > MAX_MEME || memeNumber <= 0)
            return message.reply({
                embeds: [
                    errorEmbed().setDescription(
                        `Choisissez un nombre entre 1 et ${MAX_MEME}`
                    ),
                ],
                ephemeral: true,
            });

        for (let i = 0; i < memeNumber; i++) {
            let messageMeme;

            let [data] = await fetch(
                "https://www.reddit.com/r/memes/random/.json"
            ).then((res) => res.json());

            const [post] = data.data.children;

			const permalink = post.data.permalink;
			const memeUrl = `https://reddit.com${permalink}`;
			const memeImage = post.data.url;
			const memeTitle = post.data.title;
			const memeUpvotes = post.data.ups;
			const memeNumComments = post.data.num_comments;


            let embedReponse = new EmbedBuilder()
                .setTitle(memeTitle)
                .setURL(memeUrl)
                .setColor("Random")
                .setFooter({text: memeUpvotes + " Upvotes | " + memeNumComments + " Comments" })
                .setTimestamp()
                .setImage(memeImage);
            if (i == 0) {
                messageMeme = await message.reply({
                    embeds: [embedReponse],
                    fetchReply: true,
                });
            } else {
                messageMeme = await message.channel.send({
                    embeds: [embedReponse],
                    fetchReply: true,
                });
            }
            try {
                await messageMeme.react(
                    message.guild.emojis.cache.find(
                        (emoji) => emoji.name === "upvote"
                    )
                );
                await messageMeme.react(
                    message.guild.emojis.cache.find(
                        (emoji) => emoji.name === "downvote"
                    )
                );
            } catch (e) {
                console.log("Le serveur n'a pas les émojis !");
            }
        }
    },
};
