const { CommandInteraction, EmbedBuilder, Client, SlashCommandBuilder } from "discord.js");
const { errorEmbed, successEmbed } from "../../util/Embeds");
const db from "../../Models/channels");
const ticketDB from "../../Models/tickets");
 

export default {
    data: new SlashCommandBuilder()
        .setName("ticket-disable")
        .setDescription("Désactive le système de tickets."),

    /**
     *
     *
     * @param {CommandInteraction} message
     * @param {Client} client
     *
     */
    async execute(message, client) {
        await message.deferReply();

        const Owner = await message.guild.fetchOwner();

        if (!message.guild.members.me.permissions.has("MANAGE_GUILD"))
            return message.editReply({
                embeds: [
                    errorEmbed().setDescription(
                        "Je n'ai pas la permission `MANAGE_GUILD` pour utiliser cette commande."
                    ),
                ],
                ephemeral: true,
            });
        if (message.member.id !== Owner.id)
            return message.editReply({
                embeds: [
                    errorEmbed().setDescription(
                        "Seul le propriétaire du serveur peut utiliser cette commande."
                    ),
                ],
                ephemeral: true,
            });

        db.findOne({ GuildID: message.guild.id }, async (err, res) => {
            if (err)
                return message.editReply({
                    embeds: [
                        errorEmbed().setDescription(
                            `Une erreur est survenue: \`${err}\``
                        ),
                    ],
                    ephemeral: true,
                });

            if (res) {
                if (!res.TicketSystem)
                    return message.editReply({
                        embeds: [
                            errorEmbed().setDescription(
                                "Le système de tickets est déjà désactivé."
                            ),
                        ],
                        ephemeral: true,
                    });
                if (res.TicketSystem) {
                    ticketChannels = [
                        res.TicketSystem.ticketParentChannel,
                        res.TicketSystem.transcriptChannel,
                        res.TicketSystem.openticketChannel,
                    ];

                    let oui = await ticketDB
                        .find({ GuildID: message.guild.id }, (err, res) => {
                            if (err)
                                return message.editReply({
                                    embeds: [
                                        errorEmbed().setDescription(
                                            `Une erreur est survenue: \`${err}\``
                                        ),
                                    ],
                                    ephemeral: true,
                                });
                            if (res) {
                                res.forEach((ticket) => {
                                    ticketChannels.push(ticket.ChannelID);
                                });
                            }
                        })
                        .clone();

                    for (channel of ticketChannels) {
                        if (message.channelId === channel)
                            return message.editReply({
                                embeds: [
                                    errorEmbed().setDescription(
                                        "Vous ne pouvez pas désactiver le système de ticket sous peine de crash.\nVeuillez réutilisez la commande dans un autre salon textuel."
                                    ),
                                ],
                                ephemeral: true,
                            });
                    }

                    try{
                        ticketChannels.forEach(async (channel) => {
                            await message.guild.channels.cache.get(channel).delete();
                        });
                    } catch (err) { console.log(channel + "not found"); }

                    await ticketDB
                        .find({ GuildID: message.guild.id }, (err, res) => {
                            if (res) {
                                res.forEach((ticket) => {
                                    ticket.delete();
                                });
                            }
                        })
                        .clone();

                    res.TicketSystem = null;

                    res.save().catch((err) => {
                        message.editReply({
                            embeds: [
                                errorEmbed().setDescription(
                                    `Une erreur est survenue: \`${err}\``
                                ),
                            ],
                            ephemeral: true,
                        });
                    });
                    message.editReply({
                        embeds: [
                            successEmbed().setDescription(
                                "Le système de tickets a été désactivé."
                            ),
                        ],
                        ephemeral: true,
                    });
                }
            } else {
                message.editReply({
                    embeds: [
                        errorEmbed().setDescription(
                            "Le système de tickets est déjà désactivé."
                        ),
                    ],
                    ephemeral: true,
                });
            }
        }).clone();
    },
};
