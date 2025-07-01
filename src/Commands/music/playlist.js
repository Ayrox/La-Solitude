import { EmbedBuilder, CommandInteraction, SlashCommandBuilder} from "discord.js";
import * as Embed from "../../Util/Embeds.js";
import db from "../../Models/channels.js";
 

export const command = {
    data: new SlashCommandBuilder()
        .setName("playlist")
        .setDescription("Affiche vos playlist"),

    async execute(message) {
        //! NE SERT A RIEN
    },
};
