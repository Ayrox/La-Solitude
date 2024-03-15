import { EmbedBuilder } from 'discord.js'
import config from '../../config.js'


export default {
    
    name: 'channelCreate',
    once: false,

    async execute(channel) {

        let channelDate = channel.createdAt

        const channelEmbed = new EmbedBuilder()
            .setTitle("**Un channel a été créé !**")
            .setColor("#3CE73C")
            .setDescription('**Date** : '+`${channelDate.getDate()}/${channelDate.getMonth()+1}/${channelDate.getFullYear()} à ${channelDate.getHours()}:${String(channelDate.getMinutes()).padStart(2, '0')}` )
            .addFields(
                {
                    name:'Nom',
                    value: `${channel.name}`,
                    inline: true
                },
                {
                    name: 'Type',
                    value: channel.type, 
                    inline: true
                },
                {
                    name: 'ID',
                    value: channel.id
                }
            )
            .setTimestamp()

        

        try {       
            channel.guild.channels.cache.get((await config(channel.guild.id)).channel.logID).send({ embeds : [channelEmbed] });
        } catch (e) {
            console.log(e);
        }

       
    }
}