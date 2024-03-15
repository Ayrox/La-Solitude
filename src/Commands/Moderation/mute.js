const ms from "ms");
const { CommandInteraction, SlashCommandBuilder } from "discord.js");
const db from "../../Models/infraction");
const { errorEmbed, muteEmbed } from "../../util/Embeds");
 

export default {
    //TODO A REFAIRE
    //TODO A REFAIRE
    //TODO A REFAIRE
    //TODO A REFAIRE
    data: new SlashCommandBuilder()
        .setName("mute")
        .setDescription("Mute un membre du serveur"),

    // name: "mute",
    // description: "Mute un membre du serveur",
    // permission: "MUTE_MEMBERS",
    // active: true,
    // options: [
    //     {
    //         name: "member",
    //         description: "Le membre à mute",
    //         type: "USER",
    //         required: true,
    //     },
    //     {
    //         name: "reason",
    //         description: "Raison du mute",
    //         type: "STRING",
    //         required: true,
    //     },
    //     {
    //         name: "duration",
    //         description: "Durée du mute",
    //         type: "NUMBER",
    //         required: true,
    //     },
    //     {
    //         name: "duration-type",
    //         description: "Type de durée du mute",
    //         type: "STRING",
    //         required: true,
    //         choices: [
    //             {
    //                 name: "Seconds",
    //                 value: "seconds",
    //             },
    //             {
    //                 name: "Minutes",
    //                 value: "minutes",
    //             },
    //             {
    //                 name: "Hours",
    //                 value: "hours",
    //             },
    //             {
    //                 name: "Days",
    //                 value: "days",
    //             },
    //             {
    //                 name: "Weeks",
    //                 value: "weeks",
    //             },
    //             {
    //                 name: "Months",
    //                 value: "months",
    //             },
    //         ],
    //     },
    // ],
    /**
     *
     * @param { CommandInteraction } message
     *
     */

    async execute(message) {
        message.deferReply;
        let Target = message.options.getMember("member");
        let Reason = message.options.getString("reason");
        let Duration = message.options.getNumber("duration");
        let DurationType = message.options.getString("duration-type");

        // Create a mute role if it doesn't exist.

        let muteRole = message.guild.roles.cache.find(
            (r) => r.name === "Muted"
        );
        if (!muteRole) {
            try {
                muteRole = await message.guild.roles.create({
                    name: "Muted",
                    color: "#000000",
                    permissions: [],
                });

                await message.guild.channels.cache.map(async (channel) => {
                    await channel.permissionOverwrites.edit(muteRole, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false,
                        SEND_TTS_MESSAGES: false,
                        ATTACH_FILES: false,
                        SPEAK: false,
                    });
                });
            } catch (e) {
                console.log(e);
            }
        }
        if (Target.id === message.member.id)
            return message.reply({
                embeds: [
                    errorEmbed().setDescription("Vous ne pouvez vous mute !"),
                ],
                ephemeral: true,
            });
        if (Target.roles.cache.has(muteRole.id))
            return message.reply({
                embeds: [
                    errorEmbed().setDescription(
                        "Cette personne est déjà mute !"
                    ),
                ],
                ephemeral: true,
            });
        if (Target.id === message.client.user.id)
            return message.reply({
                embeds: [
                    errorEmbed().setDescription("Vous ne pouvez pas me mute !"),
                ],
                ephemeral: true,
            });
        if (Target.id === message.guild.ownerID)
            return message.reply({
                embeds: [
                    errorEmbed().setDescription(
                        "Vous ne pouvez pas mute le propriétaire du serveur !"
                    ),
                ],
                ephemeral: true,
            });
        if (
            Target.roles.highest.position >
            message.member.roles.highest.position
        )
            return message.reply({
                embeds: [
                    errorEmbed().setDescription(
                        "Vous ne pouvez pas mute une personne ayant plus de droit que vous !"
                    ),
                ],
                ephemeral: true,
            });

        db.findOne(
            { GuildID: message.guild.id, UserID: Target.id },
            async (err, data) => {
                if (err) console.log(err);
                if (!data) {
                    data = new db({
                        GuildID: message.guild.id,
                        GuildName: message.guild.name,
                        UserID: Target.id,
                        MuteData: [
                            {
                                ExecutorID: message.member.id,
                                ExecutorTag: message.member.user.tag,
                                TargetID: Target.id,
                                TargetTag: Target.user.tag,
                                Reason: Reason,
                                Duration: `${Duration} ${DurationType}`,
                                Date: parseInt(message.createdTimestamp / 1000),
                            },
                        ],
                    });
                } else {
                    const MuteDataObject = {
                        ExecutorID: message.member.id,
                        ExecutorTag: message.member.user.tag,
                        TargetID: Target.id,
                        TargetTag: Target.user.tag,
                        Reason: Reason,
                        Duration: Duration,
                        Date: parseInt(message.createdTimestamp / 1000),
                    };

                    data.MuteData.push(MuteDataObject);
                }
                data.save().catch((err) => console.log(err));

                Target.send({
                    embeds: [
                        muteEmbed()
                            .setDescription(
                                `Vous avez été mute par ${message.member} sur le serveur **${message.guild.name}**`
                            )
                            .addFields(
                                {
                                    name:"Raison :", 
                                    value: Reason
                                },
                                {
                                    name: "Durée :", 
                                    value: `${Duration} ${DurationType}`
                                },
                            )
                    ],
                }).catch(() => {
                    console.log(
                        `${Target.user.tag} n'a pas pu être notifié de son mute.`
                    );
                });

                Target.roles.add(muteRole);

                setTimeout(
                    async () => {
                        Target.roles.remove(muteRole);
                    },
                    ms(`${Duration} ${DurationType}`) > 21474836477
                        ? 21474836476
                        : ms(`${Duration} ${DurationType}`)
                );

                message.reply({
                    embeds: [
                        muteEmbed()
                            .addFields(
                                {
                                    name: "Membre :",
                                    value: `${Target} | \`${Target.id}\``
                                },
                                {
                                    name :"Raison :", 
                                    value: Reason
                                },
                                { 
                                    name:"Durée :",
                                    value: `${Duration} ${DurationType}`
                                }
                            )
                    ],
                });
            }
        );
    },
};
