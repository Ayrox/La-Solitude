const { MessageEmbed } = require('discord.js')
const config = require('../../config.json')



module.exports = {
    
    name: 'messageUpdate',
    once: false,

    async execute(oldMessage, newMessage) {

        if (newMessage.channel.id === config.channel.logID) return;
        if (oldMessage.content === newMessage.content) return;

        let logs = await newMessage.guild.fetchAuditLogs({type: "MESSAGE_UPDATE"});
        let entry = logs.entries.first(a => Date.now() - a.createdTimestamp < 20000);

        const messageEmbed = new MessageEmbed()
            .setTitle("**Un message a été modifié !**")
            .setColor("#3CE7E7")
            .addField('Auteur', newMessage.member.user.tag, true)
            .addField('Modifié par', entry.executor || "`None`", true)
            .addField('Channel', newMessage.channel.name)
            .addField('Ancien Message', (oldMessage.content == null || oldMessage.content == "") ? "`None`" : oldMessage.content)
            .addField('Nouveau Message', (newMessage.content == null || newMessage.content == "") ? "`None`" : newMessage.content)
            .addField('URL', `[Voir le message](${newMessage.url})`)
            .setTimestamp()
          
                
        newMessage.guild.channels.cache.get(config.channel.logID).send({ embeds : [messageEmbed] });
    
       
    }
}