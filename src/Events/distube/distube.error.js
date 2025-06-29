import { DisTube } from "distube";
import * as Embed from "../../util/Embeds.js";
import config from "../../config.js";

export const event = {
    name: 'error',
    once: false,

    
/**
 * @param {DisTube.Queue} queue
 * @param {DisTube.Song} song
 */
    async execute(queue, error) {
        
        try{
            console.error(`[${new Date().toISOString()}] [EVENT] [DISTUBE_ERROR] [ERROR]`, error);
        } catch (e) {
            console.log(e)
        }

        try {
            const textChannel = queue.textChannel;
            if (!textChannel) return;
            const guildConf = await config(textChannel.guild.id);
            const logID = guildConf.channel.logID;
            const logChannel = textChannel.guild.channels.cache.get(logID);
            if (logChannel) {
                await logChannel.send({ embeds: [Embed.errorEmbed().setDescription(`${error}`)] });
            }
        } catch (err) {
            console.log(err);
        }

    }
}
