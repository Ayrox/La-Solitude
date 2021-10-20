const { MessageActionRow, MessageButton, MessageEmbed, Message} = require('discord.js')

module.exports = {
    
    //! la commande fonctionne pour des petits nombre mais pas pour les grand (genre 300secondes)

    name: "fastforward",
    aliases: ["ff"],
    description: "fast forward to x into the music",
    permission: "ADMINISTRATOR",
    active: true,
    options: [
        {
            name: "time",
            description: `Number of second to skip`,
            type: "INTEGER",
            required: true,
        }
    ],
    async execute(message, client) {

        timeToSkip = message.options.getInteger('time')
        const queue = client.distube.getQueue(message)
        if (!queue) return message.reply(`⛔ **Erreur**: ⛔ | There is nothing in the queue right now!`)
        queue.seek(timeToSkip)
        message.reply(`Seeked to ${timeToSkip}!`)
    }
}