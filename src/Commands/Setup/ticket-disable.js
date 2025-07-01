import { CommandInteraction, EmbedBuilder, Client, SlashCommandBuilder } from "discord.js";
import * as Embed from "../../Util/Embeds.js";
import db from "../../Models/channels.js";
import ticketDB from "../../Models/tickets.js";
 

export const command = {
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
        try {
            await message.deferReply();

            const Owner = await message.guild.fetchOwner();

            if (!message.guild.members.me.permissions.has("MANAGE_GUILD")) {
                return message.editReply({
                    embeds: [
                        Embed.errorEmbed().setDescription(
                            "Je n'ai pas la permission `MANAGE_GUILD` pour utiliser cette commande."
                        ),
                    ],
                    ephemeral: true,
                });
            }
            if (message.member.id !== Owner.id) {
                return message.editReply({
                    embeds: [
                        Embed.errorEmbed().setDescription(
                            "Seul le propriétaire du serveur peut utiliser cette commande."
                        ),
                    ],
                    ephemeral: true,
                });
            }

            db.findOne({ GuildID: message.guild.id }, async (err, res) => {
                if (err) {
                    return message.editReply({
                        embeds: [
                            Embed.errorEmbed().setDescription(
                                `Une erreur est survenue: \`${err}\``
                            ),
                        ],
                        ephemeral: true,
                    });
                }

                if (res) {
                    if (!res.TicketSystem) {
                        return message.editReply({
                            embeds: [
                                Embed.errorEmbed().setDescription(
                                    "Le système de tickets est déjà désactivé."
                                ),
                            ],
                            ephemeral: true,
                        });
                    }
                    if (res.TicketSystem) {
                        const ticketChannels = [
                            res.TicketSystem.ticketParentChannel,
                            res.TicketSystem.transcriptChannel,
                            res.TicketSystem.openticketChannel,
                        ];

                        await ticketDB
                            .find({ GuildID: message.guild.id }, (err, res) => {
                                if (err) {
                                    return message.editReply({
                                        embeds: [
                                            Embed.errorEmbed().setDescription(
                                                `Une erreur est survenue: \`${err}\``
                                            ),
                                        ],
                                        ephemeral: true,
                                    });
                                }
                                if (res) {
                                    res.forEach((ticket) => {
                                        ticketChannels.push(ticket.ChannelID);
                                    });
                                }
                            })
                            .clone();

                        for (const channel of ticketChannels) {
                            if (message.channelId === channel) {
                                return message.editReply({
                                    embeds: [
                                        Embed.errorEmbed().setDescription(
                                            "Vous ne pouvez pas désactiver le système de ticket sous peine de crash.\nVeuillez réutilisez la commande dans un autre salon textuel."
                                        ),
                                    ],
                                    ephemeral: true,
                                });
                            }
                        }

                        try {
                            for (const channel of ticketChannels) {
                                await message.guild.channels.cache.get(channel)?.delete();
                            }
                        } catch (err) {
                            console.log(channel + " not found");
                        }

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
                                    Embed.errorEmbed().setDescription(
                                        `Une erreur est survenue: \`${err}\``
                                    ),
                                ],
                                ephemeral: true,
                            });
                        });
                        message.editReply({
                            embeds: [
                                Embed.successEmbed().setDescription(
                                    "Le système de tickets a été désactivé."
                                ),
                            ],
                            ephemeral: true,
                        });
                    }
                } else {
                    message.editReply({
                        embeds: [
                            Embed.errorEmbed().setDescription(
                                "Le système de tickets est déjà désactivé."
                            ),
                        ],
                        ephemeral: true,
                    });
                }
            }).clone();
        } catch (error) {
            console.error(`[${new Date().toISOString()}] [COMMAND] [TICKET-DISABLE] [ERROR] Une erreur s'est produite dans la commande 'ticket-disable' :`, error);
            await message.editReply({
                embeds: [
                    {
                        description: "❌ Une erreur inattendue s'est produite. Veuillez réessayer plus tard.",
                        color: 0xff0000,
                    },
                ],
            });
        }
    },
};
