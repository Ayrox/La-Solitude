import { EmbedBuilder, CommandInteraction, SlashCommandBuilder } from "discord.js";
import * as Embed from "../../util/Embeds.js";
import db from "../../Models/channels.js";
 

export const command = {
    
    data: new SlashCommandBuilder()
        .setName("set-channel")
        .setDescription("Défini les salons utilisés par le bot")
        .addStringOption(option =>
            option.setName('channel')
            .setDescription('Le salon à définir')
            .setRequired(true)
            .addChoices(
            {
                name: "log",
                value: "log",
            },
            {
                name: "report",
                value: "report",
            },
            {
                name: "Bienvenue",
                value: "welcome",
            },
            {
                name: "Au revoir",
                value: "goodbye",
            },
            )
        ),

    
    /**
     *
     * @param {CommandInteraction} message
     */
    async execute(message) {
        try {
            if (!message.member.permissions.has("ADMINISTRATOR")) {
                return message.reply({
                    embeds: [
                        Embed.errorEmbed().setDescription(
                            "Vous devez être un Administrateur pour utiliser cette commande"
                        ),
                    ],
                    ephemeral: true,
                });
            }

            // Update the specified channel setting in the DB using upsert
            {
                const selection = message.options.getString("channel");
                const fieldMap = {
                    log: 'LogChannelID',
                    report: 'ReportChannelID',
                    welcome: 'WelcomeChannelID',
                    goodbye: 'ByeChannelID',
                    music: 'MusicChannelID'
                };
                const field = fieldMap[selection];
                if (!field) throw new Error(`Invalid channel selection ${selection}`);
                await db.findOneAndUpdate(
                    { GuildID: message.guild.id },
                    { [field]: message.channel.id },
                    { upsert: true }
                ).exec();
            }
            // Respond
             
            return message.reply({
                 embeds: [
                     Embed.setChannelEmbed().setDescription(
                         `le salon \`${message.options.getString(
                             "channel"
                         )}\` est maintenant défini dans le salon : ${
                             message.channel
                         }  `
                     ),
                 ],
                 ephemeral: true,
            });
        } catch (error) {
            console.error(`[${new Date().toISOString()}] [COMMAND] [SET-CHANNEL] [ERROR] Une erreur s'est produite dans la commande 'set-channel' :`, error);
            await message.reply({
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
