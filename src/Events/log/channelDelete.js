import { EmbedBuilder } from 'discord.js'
import config from '../../config.js'

export default {
    
    name: 'channelDelete',
    once: false,

    async execute(channel) {

        let channelDate = channel.createdAt
        let channelDeleteDate = new Date()

        const channelEmbed = new EmbedBuilder()
            .setTitle("**Un channel a été supprimé !**")
            .setColor("#E73C3C")
            .setDescription('**Date de création** : '+`${channelDate.getDate()}/${channelDate.getMonth()+1}/${channelDate.getFullYear()} à ${channelDate.getHours()}:${String(channelDate.getMinutes()).padStart(2, '0')}` )
            .addFields(
                {
                    name: 'Nom',
                    value: `${channel.name}`,
                    inline: true
                },
                {
                    name: 'Type',
                    value: `${channel.type}`,
                    inline: true
                },
                {
                    name:'ID',
                    value: `${channel.id}`
                },
                {
                    name: 'Supprimé le : ',
                    value: `${channelDeleteDate.getDate()}/${channelDeleteDate.getMonth()+1}/${channelDeleteDate.getFullYear()} à ${channelDeleteDate.getHours()}:${String(channelDeleteDate.getMinutes()).padStart(2, '0')}`
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