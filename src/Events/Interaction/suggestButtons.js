const { ButtonInteraction, Client } = require("discord.js");
const { errorEmbed } = require("../../util/Embeds");
const db = require("../../Models/suggest")
module.exports = {

    name: "interactionCreate",
    

    async execute(interaction, client) {

        if (!interaction.isButton()) return;
                
        const { guildId, customId, message } = interaction;
        
        buttonsID = ["suggest-delete", "suggest-accept", "suggest-decline"];
        
        if (!buttonsID.includes(customId)) return;
        
        
        if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ embeds: [errorEmbeds().setDescription("Vous n'avez pas la permission d'utiliser ce bouton")], ephemeral: true });
        
        await db.findOne({ MessageID: message.id }, async (err, data) => {
            
            if (err) throw err;
            if (!data) return interaction.reply({ embeds: [errorEmbed().setDescription("Aucune donnée n'a été trouvé")], ephemeral: true });

            const Embed = message.embeds[0];
            if (!Embed) return;

            switch (customId) {
                case "suggest-accept": {
                        Embed.data.fields[4] = { name: "**🔷 Statut**", value: "🟢 Accepté", inline: true };
                        message.edit({ embeds: [Embed.setColor("GREEN")], components:[] });
                        data.Details[0].Status = "Accepted";
                        data.save()
                        return interaction.reply({ content: "Suggestion Accepted !", ephemeral: true });
                    }
                    break;
                case "suggest-decline": {
                        Embed.data.fields[4] = { name: "**🔷 Statut**", value: "🔴 Refusé", inline: true };
                        message.edit({ embeds: [Embed.setColor("RED")], components: [] });
                        data.Details[0].Status = "Declined";
                        data.save();
                        return interaction.reply({ content: "Suggestion Declined !", ephemeral: true });
                    }
                    break;
                case "suggest-delete": {
                        message.delete();
                        await data.delete();
                        return interaction.reply({ content: "Suggestion Deleted !", ephemeral: true });
                    }
                    break;
            }
        }).clone();


    }

    
}