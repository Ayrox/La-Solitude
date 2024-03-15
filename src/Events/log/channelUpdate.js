import { EmbedBuilder } from 'discord.js'
import config from '../../config.js'

export default {
    
    name: 'channelUpdate',
    once: false,

    async execute(oldChannel, newChannel) {

       
        const channelEmbed = new EmbedBuilder()
            .setTitle("**Un channel a été modifié !**")
            .addFields(
                {
                    name: "Nom Actuel",
                    value: newChannel.name
                }
            )
            .setColor("#3CE7E7")
            .setTimestamp()

            .setDescription("")

        if (oldChannel.name != newChannel.name) {

            channelEmbed.addFields(
                {
                    name: "Changement de **nom**",
                    value: `\`${oldChannel.name}\` a été renommé en \`${newChannel.name}\` `
                }
            )
            
        }
        
        else if (oldChannel.permissionOverwrites.cache !== newChannel.permissionOverwrites.cache) {

            channelEmbed.addFields(
                {   
                    name: "Changement de **permissions**",
                    value: "une ou plusieurs permissions ont été changées"
                }
            )
            
        }
        

        
        try {       
            newChannel.guild.channels.cache.get((await config(newChannel.guild.id)).channel.logID).send({ embeds : [channelEmbed] });
        } catch (e) {
            console.log(e);
        }
    }
}