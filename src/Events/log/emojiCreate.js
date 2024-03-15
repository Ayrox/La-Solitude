import { EmbedBuilder } from 'discord.js'
import config from "../../config.js"

export default {
    
    name: 'emojiCreate',
    once: false,
    
    async execute(emoji) {
        
        let emojiDate = emoji.createdAt
        
        const emojiEmbed = new EmbedBuilder()
            .setTitle("**Un émoji a été créé !**")
            .setThumbnail(emoji.url)
            .setColor("#3CE73C")
            .setDescription('**Date** : '+`${emojiDate.getDate()}/${emojiDate.getMonth()+1}/${emojiDate.getFullYear()} à ${emojiDate.getHours()}:${String(emojiDate.getMinutes()).padStart(2, '0')}` )
            .addFields(
                {
                    name:'Nom',
                    value: `:${emoji.name}:`,
                    inline: true
                },
                {
                    name:'Animé ?',
                    value: (emoji.animated) ? "Oui":"Non"
                },{
                    name: 'ID',
                    value: emoji.id
                }
            )
            .setTimestamp()
        
        
        
        try {       
            emoji.guild.channels.cache.get((await config(emoji.guild.id)).channel.logID).send({ embeds : [emojiEmbed] });
        } catch (e) {
            console.log(e);
        }
       
    }
}