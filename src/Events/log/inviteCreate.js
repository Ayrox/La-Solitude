import { EmbedBuilder } from 'discord.js'
import config from "../../config.js"


export default {
    
    name: 'inviteCreate',
    once: false,

    async execute(invite) {

        
        let inviteDate = invite.createdAt
        let inviteExpireDate = invite.expiresAt

        let Expiration

        if (inviteExpireDate == null) {

            Expiration = "Jamais"

        } else {

            Expiration = `${inviteExpireDate.getDate()}/${inviteExpireDate.getMonth()+1}/${inviteExpireDate.getFullYear()} à ${inviteExpireDate.getHours()}:${String(inviteExpireDate.getMinutes()).padStart(2, '0')}`
        }

        const inviteEmbed = new EmbedBuilder()
            .setTitle("**Une invitation a été créée !**")
            .setColor("#3CE73C")
            .setDescription('**Crée le :** '+`${inviteDate.getDate()}/${inviteDate.getMonth()+1}/${inviteDate.getFullYear()} à ${inviteDate.getHours()}:${String(inviteDate.getMinutes()).padStart(2, '0')}` )
            .addFields(
                {
                    name:'Par',
                    value: `${invite.inviter}`,
                    inline: true
                },
                {
                    name: 'Utilisation Max',
                    value: (invite.maxUses === 0 ) ? 'Infini': `${invite.maxUses}`,
                    inline: true
                },
                {
                    name: 'Channel visé : ',
                    value: invite.channel.name,
                    inline: true
                },
                {
                    name: 'Expire le :',
                    value: Expiration
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