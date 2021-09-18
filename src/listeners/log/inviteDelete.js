const { Listener } = require('discord-akairo');
const { MessageEmbed } = require('discord.js')
const config = require('../../config.json')

class InviteDeleteListener extends Listener {
    constructor() {
        super('inviteDelete', {
            emitter: 'client',
            event: 'inviteDelete'
        });
    }

    exec(invite) {
        
        let inviteDate = invite.createdAt
        let inviteExpireDate = invite.expiresAt

        const inviteEmbed = new MessageEmbed()
            .setTitle("Une invitation a été suprimée/expirée !")
            .setColor("#E73C3C")
            .addField('Channel visé : ', invite.channel.name)
            .addField("Nombre d'utilisation : ", (invite.uses == null) ? "0" : `${invite.uses}`)
            .addField('URL', invite.url)
            .setTimestamp()
                    

        invite.guild.channels.cache.get(config.channel.logID).send({ embeds : [inviteEmbed] });
    
    }
}

module.exports = InviteDeleteListener; 