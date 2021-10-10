const { Client, CommandInteraction, MessageEmbed } = require('discord.js')
const { execute } = require('../guild/guildCreate')

module.exports = {

    name: "interactionCreate",
    
    async execute(interaction, client) {
        
        if (interaction.isCommand()) {
            const command = client.command.get(interaction.commandName);
            if (!command) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor("RED")
                        .setTitle("⛔⛔ **ERREUR** ⛔⛔")
                        .setDescription("Une erreur a été rencontrée lors du lancement de cette commande")
                ]
            }) && client.commands.delete(interaction.commandName);

            command.execute(interaction,client)
        }


    }

}