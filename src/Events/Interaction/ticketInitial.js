import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonInteraction } from 'discord.js';
import * as Embed from "../../util/Embeds.js";
import conf from "../../config.js";
import db from "../../Models/tickets.js";


export default {

    name: "interactionCreate",

    /**
     * 
     * @param {ButtonInteraction} interaction 
     */

    async execute(interaction) {
        try {
            if (!interaction.isButton()) return;
        
            const { guild, member, customId } = interaction;
        
            if (!["ticket-member", "ticket-bug", "ticket-other"].includes(customId)) return;
        
            const ticketChannels = (await conf(interaction.guild.id)).channel.TicketSystem;

            await interaction.deferUpdate();

            const ID = Math.floor(Math.random() * 90000) + 10000;
        
            await guild.channels.create(
                {
                    name: `ticket-${ID}`, 
                    options: {
                        type: 0,
                        parent: ticketChannels.ticketParentChannel,
                        permissionOverwrites: [
                            {
                                id: member.id,
                                allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES", "ADD_REACTIONS", "EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "READ_MESSAGE_HISTORY"],
                            },
                            {
                                id: guild.roles.everyone,
                                deny: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES", "ADD_REACTIONS", "EMBED_LINKS", "USE_EXTERNAL_EMOJIS", "READ_MESSAGE_HISTORY"]
                            }
                        ]
                    }
                }
            ).then(async channel => {
                await db.create({
                    GuildID: guild.id,
                    MemberID: member.id,
                    TicketID: ID,
                    ChannelID: channel.id,
                    Closed: false,
                    Locked: false,
                    Type: customId,
                });
        

                const Embed = new EmbedBuilder()
                    .setAuthor({name:`🎫 -- ${guild.name} | Système de Ticket -- 🎫`, url: guild.iconURL({ dynamic: true, format: "png" })})
                    .setColor("#0099ff")
                    .setDescription(`Veuillez patienter pour une réponse d'un administrateur, pendant ce temps, vous pouvez en profiter pour décrire votre problème.`)
                    .setFooter({text:"Les boutons ci-dessous sont réservés aux administrateurs du serveur."})
                    .setTimestamp()

                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel("Sauvegarder et Fermer")
                        .setCustomId("ticket-close")
                        .setStyle("Primary")
                        .setEmoji("💾"),
                
                    new ButtonBuilder()
                        .setLabel("Bloquer")
                        .setCustomId("ticket-lock")
                        .setStyle("Secondary")
                        .setEmoji("🔒"),
                
                    new ButtonBuilder()
                        .setLabel("Débloquer")
                        .setCustomId("ticket-unlock")
                        .setStyle("Success")
                        .setEmoji("🔓")
                        .setDisabled(true),
                    
                );

                channel.send({ embeds: [Embed], components: [row] });
            
                await channel.send({ content: `${member}, votre ticket a été créé avec succès.` })
                    .then(async msg => {
                        setTimeout(async () => {
                            await msg.delete().catch(() => { });
                        }, 5000);
                    });
            });
            interaction.editReply({ embeds: [Embed.successEmbed().setDescription("Le salon de ticket a été créé avec succès")], ephemeral: true });
        } catch (e) {
            console.log(e);
            interaction.editReply({ embeds: [Embed.errorEmbed().setDescription(`Une erreur est survenue lors de la création du salon de ticket.\n\n${e.message}`)], ephemeral: true });
        }



    }

}