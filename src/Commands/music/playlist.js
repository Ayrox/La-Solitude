import { EmbedBuilder, CommandInteraction, SlashCommandBuilder} from "discord.js";
import * as Embed from "../../util/Embeds";
import db from "../../Models/channels";
 

export default {
    data: new SlashCommandBuilder()
        .setName("playlist")
        .setDescription("Affiche vos playlist"),

    async execute(message) {
        //! NE SERT A RIEN
    },
};
