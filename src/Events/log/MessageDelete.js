import { EmbedBuilder, AttachmentBuilder, AuditLogEvent } from 'discord.js'
import config from "../../config.js"


export const event = {
    name: 'messageDelete',
    once: false,

    async execute(message, client) {


        //if (/*message.author.bot||*/ message.member.id === client.user.id) return;

        const { channel } = await config(message.guild.id)

        for(const [key, value] of Object.entries(channel)){
            if (message.channel.id === value) return;
        };


        let logs = await message.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MessageDelete
        });
        let entry = logs.entries.first(a =>    
            Date.now() - a.createdTimestamp < 20000
        );
        

        // Updated console.log for better formatting
        console.log(`[${new Date().toISOString()}] [EVENT] [MESSAGE_DELETE] [INFO] Entry details:`, entry);
        //if (entry.length === 0) return console.log(`A message by ${message.author.tag || "someone"} was deleted, but no relevant audit logs were found.`);
        
        const embed = new EmbedBuilder()
            .setTitle("**Un message a été supprimé !**")
            .setColor("#E73C3C")
            .addFields(
                //              {name: "Auteur", value: (entry.target.id === message.author.id && entry.target.id !== null) ? entry.target.tag || message.author.tag : "None", inline: true},
                //              {name: 'Supprimé par', value: (entry.target.id === message.author.id && entry.target.id !== null) ? entry.executor.tag  : "None", inline: true},
                {
                    name: 'Channel',
                    value: "#" + message.channel.name
                },
                {
                    name: 'Message',
                    value: (message.embeds.length > 0) ? "`Embed Message`" : (message.content === null || message.content.length == 0) ? "`None`" : message.content
                },
                {
                    name: 'Attachment',
                    value: (message.attachments.size == 0) ? "`None`" : (message.attachments.size > 1) ? "plusieurs" : "1"
                }
                //              {name:'Threaded ?', value: (message.hasThread) ? "Oui" : "Non",inline: true},
                //              {name: "Raison", value: entry.reason || "Non spécifié"},
                //              {name: 'URL', value: `(Link)[$message.url]`}
            )
            .setImage((message.attachments.size == 0) ? null : `${message.attachments.first().url}`)
            .setTimestamp()
        
        // Send to log channel if configured
        {
            const logID = channel.logID;
            if (!logID) return;
            const logChannel = message.guild.channels.cache.get(logID);
            if (!logChannel) return;
            try {
                await logChannel.send({ embeds: [embed] });
            } catch (e) {
                console.log(e);
            }
        }
        
        // console.log(entry)
        // console.log("\n***************************************************************************************\n")
        // console.log(message)
       
    }
}
