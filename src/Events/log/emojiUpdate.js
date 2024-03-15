import { EmbedBuilder } from 'discord.js'
import config from "../../config.js"

export default {
    
    name: 'emojiUpdate',
    once: false,

    async execute(oldEmoji, newEmoji) {

       const emojiEmbed = new EmbedBuilder()
            .setTitle("**Un émoji a été modifié !**")
            .setColor("#3CE7E7")
            .setThumbnail(newEmoji.url)
            .addFields(
                {
                    name:'Changements : ',
                    value: `L'émoji \`:${oldEmoji.name}:\` a été renommé en \`:${newEmoji.name}:\``
                }
            )
            .setTimestamp()
        
        
        try {       
            newEmoji.guild.channels.cache.get((await config(newEmoji.guild.id)).channel.logID).send({ embeds : [emojiEmbed] });
        } catch (e) {
            console.log(e);
        }
    }
}