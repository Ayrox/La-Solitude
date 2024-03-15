import { EmbedBuilder } from 'discord.js'
import config from "../../config.js"



export default {
    
    name: 'messageUpdate',
    once: false,

    async execute(oldMessage, newMessage, client) {

        
            
        
        if (newMessage.author.bot || newMessage.member.id === client.user.id) return;

        let { channel } = await config(newMessage.guild.id)
        if (newMessage.channel.id === channel.logID) return;
        
        if (oldMessage.content === newMessage.content) return;
        
        
        let logs = await newMessage.guild.fetchAuditLogs({ type: "MESSAGE_UPDATE" });
        let entry = logs.entries.first(a => Date.now() - a.createdTimestamp < 20000);

        const EmbedBuilder = new EmbedBuilder()
            .setTitle("**Un message a été modifié !**")
            .setColor("#3CE7E7")
            .addFields(
                {
                    name: 'Auteur', 
                    value: newMessage.member.user.tag, 
                    inline: true
                },
                {
                    name: 'Modifié par', 
                    value: entry.executor || "`None`", 
                    inline: true
                },
                {
                    name: 'Channel', 
                    value: newMessage.channel.name
                },
                {
                    name: 'Ancien Message', 
                    value: (oldMessage.content == null || oldMessage.content == "") ? "`None`" : oldMessage.content
                },
                {
                    name: 'Nouveau Message', 
                    value: (newMessage.content == null || newMessage.content == "") ? "`None`" : newMessage.content
                },
                {
                    name: 'URL', 
                    value: `[Voir le message](${newMessage.url})`
                }
            )
            .setTimestamp()
          
        try {       
            newMessage.guild.channels.cache.get(channel.logID).send({ embeds : [EmbedBuilder] });
        } catch (e) {
            console.log(e);
        }
       
    }
}