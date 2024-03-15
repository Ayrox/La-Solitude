import { EmbedBuilder } from 'discord.js'
import config from "../../config.js"

export default {
    
    name: 'emojiDelete',
    once: false,

    async execute(emoji) {

        let emojiDate = emoji.createdAt
        let emojiDeleteDate = new Date()
    

        const emojiEmbed = new EmbedBuilder()
            .setTitle("**Un émoji a été supprimé !**")
            .setThumbnail(emoji.url)
            .setColor("#E73C3C")
            .setDescription( '**Date de création** : ' + `${emojiDate.getDate()}/${emojiDate.getMonth()+1}/${emojiDate.getFullYear()} à ${emojiDate.getHours()}:${String(emojiDate.getMinutes()).padStart(2, '0')}` )
            .addFields(
                {
                    name: 'Nom', 
                    value: `:${emoji.name}:`,
                    inline: true
                },
                {
                    name:'Animé ?',
                    value: (emoji.animated) ? "Oui":"Non"
                },
                {
                    name:'ID',
                    value: emoji.id
                },
                {
                    name:'Supprimé le : ',
                    value: `${emojiDeleteDate.getDate()}/${emojiDeleteDate.getMonth() + 1}/${emojiDeleteDate.getFullYear()} à ${emojiDeleteDate.getHours()}:${String(emojiDeleteDate.getMinutes()).padStart(2, '0')}`
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