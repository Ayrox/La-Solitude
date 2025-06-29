import { EmbedBuilder, CommandInteraction, SlashCommandBuilder } from "discord.js";
import * as Embed from "../../util/Embeds.js";
 
const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args)); // eslint-disable-line

export const command = {
    data: new SlashCommandBuilder()
        .setName("cat")
        .setDescription("Envoie une image de chat"),

    /**
     *
     * @param {CommandInteraction} message
     */
    async execute(message) {
        try {
            await message.deferReply();

            const fetchAPI = async () => {
                const response = await fetch(
                    "https://some-random-api.ml/animal/cat",
                    {
                        method: "GET",
                    }
                );
                return await response.json();
            };

            const data = await fetchAPI();

            const embed = new EmbedBuilder()
                .setTitle("Image de Chat")
                .setColor("#00D7FF")
                .setDescription(data.fact)
                .setImage(data.image)
                .setFooter({
                    text: `Demandé par ${message.member.user.tag}`,
                    iconURL: message.member.displayAvatarURL(),
                })
                .setTimestamp();

            await message.editReply({ embeds: [embed] });
        } catch (error) {
            console.error("❌ Une erreur s'est produite dans la commande 'cat' :", error);
            await message.editReply({
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
