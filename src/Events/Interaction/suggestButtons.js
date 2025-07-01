import { ButtonInteraction, Client } from "discord.js";
import * as Embed from "../../Util/Embeds.js";
import db from "../../Models/suggest.js";


export const event = {

    name: "interactionCreate",
    

    async execute(interaction, client) {

        if (!interaction.isButton()) return;
                
        const { guildId, customId, message } = interaction;
        
        let buttonsID = ["suggest-delete", "suggest-accept", "suggest-decline"];
        
        if (!buttonsID.includes(customId)) return;
        
        
        if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ embeds: [Embed.errorEmbeds().setDescription("Vous n'avez pas la permission d'utiliser ce bouton")], ephemeral: true });
        
        await db.findOne({ MessageID: message.id }, async (err, data) => {
            
            if (err) throw err;
            if (!data) return interaction.reply({ embeds: [Embed.errorEmbed().setDescription("Aucune donnée n'a été trouvé")], ephemeral: true });

            const Embed = message.embeds[0];
            if (!Embed) return;

            switch (customId) {
                case "suggest-accept": {
                        Embed.fields[4] = { name: "**🔷 Statut**", value: "🟢 Accepté", inline: true };
                        Embed.color="Green"
                        message.edit({ embeds: [Embed], components:[] });
                        data.Details[0].Status = "Accepted";
                        data.save()
                        return interaction.reply({ content: "Suggestion Accepted !", ephemeral: true });
                    }
                    break;
                case "suggest-decline": {
                        Embed.fields[4] = { name: "**🔷 Statut**", value: "🔴 Refusé", inline: true };
                        Embed.color="Red"
                        message.edit({ embeds: [Embed], components: [] });
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