import { EmbedBuilder, ButtonInteraction } from "discord.js";
import { errorEmbed, successEmbed } from "../../util/Embeds.js";
//import { generateFromMessages } from "discord-html-transcripts.js";
import db from "../../Models/tickets.js";
import conf from "../../config.js";
import channels from "../../Models/channels.js";

export default {
    
    name: "interactionCreate",


    /**
     * 
     * @param {ButtonInteraction} interaction 
     */

    async execute(interaction) { 
        
        if (!interaction.isButton()) return;

        const { guild, member, customId, channel } = interaction;

        if (!["ticket-close", "ticket-lock", "ticket-unlock"].includes(customId)) return;
        
        const ticketChannels = (await conf(interaction.guild.id)).channel.TicketSystem;


        if (!member.permissions.has("ADMINISTRATOR")) 
            return interaction.reply({ embeds: [errorEmbed().setDescription("Vous devez être un Administrateur pour utiliser cette commande.")], ephemeral: true });
        
        const Embed = new EmbedBuilder().setColor("#0099ff");

        db.findOne({ ChannelID: channel.id }, async (err, data) => { 
            if (err) return interaction.reply({ embeds: [errorEmbed().setDescription(`Une erreur est survenue: \`${err}\``)], ephemeral: true });
            if (!data) return interaction.reply({ embeds: [errorEmbed().setDescription("Aucune donnée trouvé, Veuillez supprimé manuellement.")], ephemeral: true });

            switch (customId) {
                case "ticket-lock":

                    interaction.message.components[0].components[1].data.disabled = true
                    interaction.message.components[0].components[2].data.disabled = false
                    interaction.message.edit({components : [interaction.message.components[0]]})
                    

                    if (data.Locked) return interaction.reply({ embeds: [errorEmbed().setDescription("Ce ticket est déjà verrouillé.")], ephemeral: true });
                    

                    await db.updateOne({ ChannelID: channel.id }, { Locked: true });
                    Embed.setDescription(` 🔒 | Le \`${channel.name}\` est maintenant verrouillé.`);
                    channel.permissionOverwrites.edit(data.MemberID, {
                        SendMessages: false,
                    })

                    interaction.reply({ embeds: [Embed] });
                    
                    break;
                
                case "ticket-unlock":
                    interaction.message.components[0].components[1].data.disabled = false
                    interaction.message.components[0].components[2].data.disabled = true
                    interaction.message.edit({components : [interaction.message.components[0]]})

                    if (!data.Locked) return interaction.reply({ embeds: [errorEmbed().setDescription("Ce ticket est déjà déverrouillé.")], ephemeral: true });
                    

                    await db.updateOne({ ChannelID: channel.id }, { Locked: false });
                    Embed.setDescription(` 🔓 | Le \`${channel.name}\` est maintenant déverrouillé.`);
                    channel.permissionOverwrites.edit(data.MemberID, {
                        SendMessages: true,
                    });

                    interaction.reply({ embeds: [Embed] });
                    
                    break;

                case "ticket-close":
                
                    interaction.message.components[0].components[0].data.disabled = true
                    interaction.message.components[0].components[1].data.disabled = true
                    interaction.message.components[0].components[2].data.disabled = true
                    interaction.message.edit({components : [interaction.message.components[0]]})

                    
                    if (data.Closed) return interaction.reply({ embeds: [errorEmbed().setDescription("Ce ticket est déjà fermé.")], ephemeral: true });
                    

                    // const transcript = await generateFromMessages({messages: channel.messages.cache.mapValues(), channel: channel, options:{
                    //     limit: -1,
                    //     returnType: 'attachment',
                    //     fileName: `${data.Type} - ${data.TicketID}.html`,
                    // }});

                    await db.updateOne({ ChannelID: channel.id }, { Closed: true });

                    const MEMBER = guild.members.cache.get(data.MemberID);
                    guild.channels.cache.get(ticketChannels.transcriptChannel).send({
                        embeds: [
                            Embed.setAuthor({name: `${MEMBER.user.tag}`,url: MEMBER.user.displayAvatarURL({ dynamic: true })})
                                .setTitle(`Transcript du ${channel.name}`) 
                                .addFields(
                                    {
                                        name: "Type",
                                        value: `${data.Type}`,
                                        inline: true
                                    },
                                    {
                                        name: "Member",
                                        value: `${MEMBER}`,
                                        inline: true
                                    }
                                )
                        ],
                        //files: [transcript],
                    });

                    interaction.reply({
                        embeds: [
                            Embed
                                .setDescription(`Le \`${channel.name}\` a été fermé.\n\nCi-joint le bilan du ticket.`)
                                .setFooter({text: `Vous avez 30 secondes avant la suppression du ticket.`})
                            
                        ],
                        //files: [transcript],
                    });


                    setTimeout(async () => {
                        channel.delete();
                    }, 30000);


                    break;

            }


        });

    }
}