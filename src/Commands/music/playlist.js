const { EmbedBuilder, CommandInteraction, SlashCommandBuilder} from "discord.js");
const { errorEmbed, setChannelEmbed } from "../../util/Embeds");
const db from "../../Models/channels");
 

export default {
    data: new SlashCommandBuilder()
        .setName("playlist")
        .setDescription("Affiche vos playlist"),

    async execute(message) {
        //! NE SERT A RIEN
    },
};
