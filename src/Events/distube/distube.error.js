import { DisTube } from "distube";
import * as Embed from "../../util/Embeds.js";

export const event = {
    name: 'error',
    once: false,

    
/**
 * @param {DisTube.Queue} queue
 * @param {DisTube.Song} song
 */
    async execute(channel, error) {
        
        try{
            console.log(`Erreurr: ${error}, dans le salon: ${channel}`)
        } catch (e) {
            console.log(e)
        }

        try{
            channel.guild.channels.cache.get((await config(newChannel.guild.id)).channel.logID).send({ embeds : [Embed.errorEmbed().setDescription(`${e}`)] });
        } catch (e) {
            console.log(e);
        }

    }
}
