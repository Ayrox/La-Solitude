import { EmbedBuilder } from 'discord.js';
import config from '../../config.js'


export const event = {
    name: 'guildMemberRemove',
    once: false,

    execute(member, client) {

        if(member.id === client.user.id) return;
        
        const exampleEmbed = new EmbedBuilder()
	        .setColor('#ff0000')
	        .setDescription(`${member} est parti(e). `)
	        .setTimestamp();

        console.log(`[${new Date().toISOString()}] [EVENT] [GUILD_MEMBER_REMOVE] [INFO] A member left:`, member.user.tag);
        
        (!config(member.guild.id).channel.au_revoirID) ? console.log("/!\\ Le salon 'au_revoir' n'est pas initialisé /!\\") : member.guild.channels.cache.get(config(member.guild.id).channel.au_revoirID).send({embeds : [exampleEmbed]})
            
        
    }
}
