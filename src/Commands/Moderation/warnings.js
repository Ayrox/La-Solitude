const { EmbedBuilder, SlashCommandBuilder } from "discord.js");
const db from "../../Models/infraction");
const { errorEmbed, warningEmbed } from "../../util/Embeds");
 

export default {
    //TODO A REFAIRE
    //TODO A REFAIRE
    //TODO A REFAIRE
    //TODO A REFAIRE
    data: new SlashCommandBuilder()
        .setName("warming")
        .setDescription("Affiche les avertissements d'un membre"),

    // name: "warnings",
    // description: "Affiche les avertissements d'un membre",
    // permission: "ADMINISTRATOR",
    // active: true,

    // options: [
    //     {
    //         name: "add",
    //         description: "Ajoute un avertissement à un membre",
    //         type: "SUB_COMMAND",
    //         options: [
    //             {
    //                 name: "target",
    //                 description: "Le membre à avertir",
    //                 type: "USER",
    //                 required: true,
    //             },
    //             {
    //                 name: "reason",
    //                 description: "Raison de l'avertissement",
    //                 type: "STRING",
    //                 required: true,
    //             },
    //             {
    //                 name: "evidence",
    //                 description: "Preuve de l'avertissement",
    //                 type: "STRING",
    //                 required: false,
    //             },
    //         ],
    //     },
    //     {
    //         name: "check",
    //         description: "Affiche les avertissements d'un membre",
    //         type: "SUB_COMMAND",
    //         options: [
    //             {
    //                 name: "target",
    //                 description:
    //                     "Le membre dont on doit afficher les avertissements",
    //                 type: "USER",
    //                 required: true,
    //             },
    //         ],
    //     },
    //     {
    //         name: "remove",
    //         description: "Supprime un avertissement d'un membre",
    //         type: "SUB_COMMAND",
    //         options: [
    //             {
    //                 name: "target",
    //                 description:
    //                     "Le membre dont on doit supprimer un avertissement",
    //                 type: "USER",
    //                 required: true,
    //             },
    //             {
    //                 name: "warn-id",
    //                 description: "L'id de l'avertissement à supprimer",
    //                 type: "NUMBER",
    //                 required: true,
    //             },
    //         ],
    //     },
    //     {
    //         name: "clear",
    //         description: "Supprime tous les avertissements d'un membre",
    //         type: "SUB_COMMAND",
    //         options: [
    //             {
    //                 name: "target",
    //                 description:
    //                     "Le membre dont on doit supprimer tous les avertissements",
    //                 type: "USER",
    //                 required: true,
    //             },
    //         ],
    //     },
    // ],

    async execute(interaction) {
        const Sub = interaction.options.getSubcommand([
            "add",
            "check",
            "remove",
            "clear",
        ]);

        const Target = interaction.options.getMember("target");
        const Reason = interaction.options.getString("reason");
        const Evidence = interaction.options.getString("evidence") || "Rien";
        const WarnID = interaction.options.getNumber("warn-id") - 1;
        const WarnDate = new Date(
            interaction.createdTimestamp
        ).toLocaleDateString();

        switch (Sub) {
            //! Add a warning

            case "add":
                if (!Target)
                    return interaction.reply({
                        embeds: [
                            errorEmbed().setDescription(
                                "Vous devez spécifiés le membre à qui vous voulez assigner un avertissement !"
                            ),
                        ],
                    });
                if (!Reason)
                    return interaction.reply({
                        embeds: [
                            errorEmbed().setDescription(
                                "Vous devez spécifiés la raison de l'avertissement ! "
                            ),
                        ],
                    });

                db.findOne(
                    {
                        GuildID: interaction.guilId,
                        UserID: Target.id,
                        UserTag: Target.user.tag,
                    },

                    async (err, data) => {
                        if (err) trow(err);
                        if (!data) {
                            data = new db({
                                GuildID: interaction.guilId,
                                GuildName: message.guild.name,
                                UserID: Target.id,
                                UserTag: Target.user.tag,
                                WarnData: [
                                    {
                                        ExecuterID: interaction.user.id,
                                        ExecuterTag: interaction.user.tag,
                                        Reason: Reason,
                                        Evidence: Evidence,
                                        Date: WarnDate,
                                    },
                                ],
                            });
                        } else {
                            data.WarnData.push({
                                ExecuterID: interaction.user.id,
                                ExecuterTag: interaction.user.tag,
                                Reason: Reason,
                                Evidence: Evidence,
                                Date: WarnDate,
                            });
                        }

                        data.save();
                    }
                );
                interaction.reply({
                    embeds: [
                        warningEmbed()
                            .setDescription(
                                `Avertissement ajouté à : ${Target.tag}  |  ||${Target.id}||`
                            )
                            .addFields(
                                {
                                    name: "Raison",
                                    value: Reason
                                },
                                {
                                    name:"Preuve",
                                    value: Evidence
                                }
                            ),
                    ],
                });
                break;

            //! Check Warnings

            case "check":
                if (!Target)
                    return message.reply({
                        embeds: [
                            errorEmbed().setDescription(
                                "Vous devez spécifier un membre !"
                            ),
                        ],
                    });

                db.findOne(
                    {
                        GuildID: interaction.guilId,
                        UserID: Target.id,
                        UserTag: Target.user.tag,
                    },
                    async (err, data) => {
                        if (err) throw err;
                        if (!data || data.Content.length === 0)
                            return interaction.reply({
                                embeds: [
                                    warningEmbed().setDescription(
                                        "Ce membre n'a aucun avertissement à son actif !"
                                    ),
                                ],
                            });

                        let Warnings = [];

                        for (let i = 0; i < data.Content.length; i++) {
                            Warnings.push(
                                `\`${i + 1}\` - ${data.Content[i].Reason} | ${
                                    data.Content[i].Evidence
                                } | ${data.Content[i].Date}`
                            );
                        }
                        interaction.reply({
                            embeds: [
                                warningEmbed()
                                    .setDescription(
                                        `Les avertissement de ${Target}`
                                    )
                                    .addFields(
                                        {
                                            name: "Avertissements :",
                                            value: Warnings.join("\n")
                                        }
                                    ),
                            ],
                        });
                    }
                );

                break;

            //! Remove a warning
            case "remove":
                if (!Target)
                    return message.reply({
                        embeds: [
                            errorEmbed().setDescription(
                                "Vous devez spécifier un membre !"
                            ),
                        ],
                    });
                if (!WarnID)
                    return message.reply({
                        embeds: [
                            errorEmbed().setDescription(
                                "Vous devez spécifier l'id d'un avertissement !\n\nUtiliser `/warnings check` pour afficher les avertissements "
                            ),
                        ],
                    });

                db.findOne(
                    {
                        GuildID: interaction.guilId,
                        UserID: Target.id,
                        UserTag: Target.user.tag,
                    },
                    async (err, data) => {
                        if (err) throw err;
                        if (!data)
                            return interaction.reply({
                                embeds: [
                                    warningEmbed().setDescription(
                                        "Ce membre n'a aucun avertissement à son acitf !"
                                    ),
                                ],
                            });
                        if (WarnID > data.Content.length)
                            return interaction.reply({
                                embeds: [
                                    warningEmbed().setDescription(
                                        "L'ID ne correspond à aucun avertissment !"
                                    ),
                                ],
                            });

                        data.Content.splice(WarnID, 1);

                        interaction.reply({
                            embeds: [
                                warningEmbed().setDescription(
                                    `L'avertissement n°${
                                        WarnID + 1
                                    } de ${Target} a été supprimé`
                                ),
                            ],
                        });
                        data.save();
                    }
                );

                break;

            //! Clear all warnings
            case "clear":
                if (!Target)
                    return interaction.reply({
                        embeds: [
                            errorEmbed().setDescription(
                                "Vous devez spécifier un membre"
                            ),
                        ],
                    });

                db.findOne(
                    {
                        GuildID: interaction.guilId,
                        UserID: Target.id,
                        UserTag: Target.user.tag,
                    },
                    async (err, data) => {
                        if (err) throw err;
                        if (!data)
                            return interaction.reply({
                                embeds: [
                                    warningEmbed().setDescription(
                                        "Ce membre n'a aucun avertissement à son actif"
                                    ),
                                ],
                            });
                        else {
                            await db.findOneAndDelete({
                                GuildID: interaction.guilId,
                                UserID: Target.id,
                                UserTag: Target.user.tag,
                            });
                            interaction.reply({
                                embeds: [
                                    warningEmbed().setDescription(
                                        `Tous les avertissement de ${Target.user.tag} ont été supprimés`
                                    ),
                                ],
                            });
                        }
                    }
                );

                break;
        }
    },
};
