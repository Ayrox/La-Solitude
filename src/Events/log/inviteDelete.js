import { EmbedBuilder } from 'discord.js'
import config from "../../config.js"


export default {
    
    name: 'inviteDelete',
    once: false,

    async execute(invite) {
        
        let inviteDate = invite.createdAt
        let inviteExpireDate = invite.expiresAt

        const inviteEmbed = new EmbedBuilder()
            .setTitle("**Une invitation a été suprimée/expirée !**")
            .setColor("#E73C3C")
            .addFields(
                {
                    name:'Channel visé : ',
                    value: invite.channel.name
                },
                {
                    name:"Nombre d'utilisation : ",
                    value: (invite.uses == null) ? "0" : `${invite.uses}`
                },
                {
                    name: 'URL',
                    value: invite.url
                }
            )
            .setTimestamp()
                    

        try {       
            invite.guild.channels.cache.get((await config(invite.guild.id)).channel.logID).send({ embeds : [inviteEmbed] });
        } catch (e) {
            console.log(e);
        }
       
    }
}