import { Message, Client } from "discord.js"


export default {
    
    name: 'messageCreate',
    once: false,

    /**
     * 
     * @param {Message} message 
     * @param {Client} client 
     */
    execute(message,client) {

        if(message.author.id !== client.user.id) console.log(`\t---> ${message.author.username} says "${message.content}" in #${message.channel.name}`)

        if (message.attachments.size > 0 && message.user.id !== message.client.user.id) {
                
            try {       
                message.react(message.guild.emojis.cache.find(emoji => emoji.name === "upvote"))
                message.react(message.guild.emojis.cache.find(emoji => emoji.name === "downvote"))
            } catch (e) {
                console.log(e);
            }
          }
        
    }
}