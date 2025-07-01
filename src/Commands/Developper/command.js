import {
    CommandInteraction,
    ActionRowBuilder,
    BaseSelectMenuBuilder,
    SlashCommandBuilder
} from "discord.js";
import * as Embed from "../../util/Embeds.js";
import db from "../../Models/commands.js";
import { glob } from "glob";
import { SortObjectArray } from "../../util/functions.js";
 

export const command = {
    data: new SlashCommandBuilder()
        .setName("command")
        .setDescription("Activation ou rechargement des commandes")
        .addSubcommand(subcommand =>
            subcommand
                .setName('enable')
                .setDescription('Activer une ou plusieurs commandes')
                .addUserOption(option => option.setName('target').setDescription('The user')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('disable')
                .setDescription('Désactiver une ou plusieurs commandes')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('reload')
                .setDescription('Recharger les commandes')
        ),
        

    /**
     * @param {CommandInteraction} interaction
     */

    async execute(message) {
        try {
            const { options, guild } = message;

            const Sub = options.getSubcommand(["enable", "disable", "reload"]);

            await message.deferReply();

            if (!message.member.permissions.has("ADMINISTRATOR")) {
                return await message.editReply({
                    embeds: [
                        {
                            description: "❌ Vous devez être Administrateur pour utiliser cette commande.",
                            color: 0xff0000,
                        },
                    ],
                    ephemeral: true,
                });
            }

            let Commandfiles = [];

            glob(`${__dirname}/../**/*.js`, (err, files) => {
                if (err)
                    return message.editReply({
                        embed: [Embed.errorEmbed().setDescription(err)],
                        ephemeral: true,
                    });

                files.forEach((file) => {
                    let cmd = require(file);
                    Commandfiles.push({
                        label: cmd.name,
                        description: cmd.description,
                        value: file,
                    });
                });
            });

            SortObjectArray(Commandfiles, "label");

            await message.editReply({
                embeds: [Embed.musicEmbed().setDescription("⏳ Chargement ...")],
                ephemeral: true,
            });

            switch (Sub) {
                case "enable":
                    break;
                case "disable":
                    const rows = [];

                    let i = 0,
                        j = 1;
                    do {
                        let row = new ActionRowBuilder().addComponents(
                            new BaseSelectMenuBuilder()
                                .setCustomId(`disable-${j}`)
                                .setPlaceholder("Rien n'est sélectionné")
                                .addOptions(
                                    Commandfiles.slice(
                                        i,
                                        Commandfiles.length < i
                                            ? Commandfiles.length - 1
                                            : i + 24
                                    )
                                )
                        );
                        rows.push(row);
                        i += 25;
                        j++;
                    } while (Commandfiles.length > i);

                    await message.editReply({
                        embeds: [
                            Embed.musicEmbed().setDescription(
                                `Sélectionner une ou plusieurs commandes à désactiver ⤵️`
                            ),
                        ],
                        components: rows,
                        ephemeral: true,
                    });

                    /*db.findOne({ GuildID: guild.id }, (err, data) => {
                        if(err) return interaction.editReply(Embed.errorEmbed().setDescription("An error occured."))
                        if (data) {
                            if (data.CommandData.includes()) {
                                
                            }


                        } else {
                            return interaction.editReply({embeds : [Embed.errorEmbed().setDescription("This guild doesn't have any commands.")]})
                        }
                       

                        data.save().catch(err => {
                            return interaction.editReply({embeds :[Embed.errorEmbed().setDescription("An error occured.")])
                        })
                    })*/

                    break;

                case "reload":
                    if (message.member.id !== "206905331366756353")
                        return await message.editReply({
                            embed: [
                                Embed.errorEmbed().setDescription(
                                    "Vous n'avez pas la permission d'utiliser cette commande : **`BOT OWNER ONLY`**"
                                ),
                            ],
                            ephemeral: true,
                        });

                    Commandfiles.forEach((file) => {
                        delete require.cache[require.resolve(file.value)];

                        let command = require(file.value);
                        console.log(`Reloaded /${file.label}`);

                        if (command.name) {
                            message.client.commands.set(command.name, command);
                        }
                    });

                    message.editReply({
                        embeds: [
                            Embed.successEmbed().setDescription(
                                "Toutes les commandes ont été rechargées"
                            ),
                        ],
                        ephemeral: true,
                    });

                    break;
            }
        } catch (error) {
            console.error(`[${new Date().toISOString()}] [COMMAND] [COMMAND] [ERROR] Une erreur s'est produite dans la commande 'command' :`, error);
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
}
