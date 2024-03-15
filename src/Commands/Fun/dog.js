const { EmbedBuilder, CommandInteraction, SlashCommandBuilder } from "discord.js");
const { errorEmbed } from "../../util/Embeds");
 
const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args)); // eslint-disable-line

export default {
    data: new SlashCommandBuilder()
        .setName("dog")
        .setDescription("Envoie une image de chien"),

    /**
     *
     * @param {CommandInteraction} message
     */
    async execute(message) {
        try {
            await message.deferReply().catch(() => {});

            const fetchAPI = async () => {
                const response = await fetch(
                    "https://some-random-api.ml/animal/dog",
                    {
                        method: "GET",
                    }
                );
                return await response.json();
            };

            const data = await fetchAPI();

            const embed = new EmbedBuilder()
                .setTitle("Dog Picture")
                .setColor("#00D7FF")
                .setDescription(data.fact)
                .setImage(data.image)
                .setFooter({

                    text: `Requested by ${message.member.user.tag}`,
                    iconURL: message.member.displayAvatarURL()
                })
                .setTimestamp();

            await message.editReply({ embeds: [embed] });
        } catch (err) {
            console.log(err);
            return message.reply({
                embeds: [
                    errorEmbed().setDescription(`Une erreur est survenue`),
                ],
                ephemeral: true,
            });
        }
    },
};
