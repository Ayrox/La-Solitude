 
const { CommandInteraction, Client, EmbedBuilder, SlashCommandBuilder } from "discord.js");
const { errorEmbed, banEmbed } from "../../util/Embeds");

const db from "../../Models/infraction");

export default {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Bannir un membre du serveur")
        .addUserOption((option) =>
            option
                .setName("membre")
                .setDescription(`Le membre à bannir`)
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("raison")
                .setDescription(`Raison du ban`)
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("commentaire")
                .setDescription(`commantaire du ban`)
                .setRequired(true)
        ),

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    execute(interaction, client) {
        const { guild, member } = interaction;
        const Target = interaction.options.getMember("member");
        const Reason = interaction.options.getString("reason");
        const Amount = interaction.options.getNumber("messages");

        if (!Target)
            return interaction.reply({
                embeds: [
                    errorEmbed().setDescription(
                        "Vous devez mentionner un membre"
                    ),
                ],
            });
        if (!Reason)
            return interaction.reply({
                embeds: [
                    errorEmbed().setDescription("Vous devez mettre une raison"),
                ],
            });
        if (!Amount)
            return interaction.reply({
                embeds: [
                    errorEmbed().setDescription(
                        "Vous devez mettre un nombre de jours"
                    ),
                ],
            });

        if (Amount > 7 || Amount < 0)
            return interaction.reply({
                embeds: [
                    errorEmbed().setDescription(
                        "Vous devez un nombre de jours entre 0 et 7"
                    ),
                ],
                ephemeral: true,
            });

        if (Target.id === member.id)
            return interaction.reply({
                embeds: [
                    errorEmbed().setDescription(
                        "Vous ne pouvez pas vous bannir"
                    ),
                ],
                ephemeral: true,
            });

        if (Target.id === client.user.id)
            return interaction.reply({
                embeds: [
                    errorEmbed().setDescription("Vous ne pouvez pas me bannir"),
                ],
                ephemeral: true,
            });
        if (Target.id === guild.ownerID)
            return interaction.reply({
                embeds: [
                    errorEmbed().setDescription(
                        "Vous ne pouvez pas bannir le propriétaire du serveur"
                    ),
                ],
                ephemeral: true,
            });

        if (Target.roles.highest.position > member.roles.highest.position)
            return interaction.reply({
                embeds: [
                    errorEmbed().setDescription(
                        "Vous ne pouvez pas bannir une personne ayant plus de droit que vous"
                    ),
                ],
                ephemeral: true,
            });
        if (Target.permissions.has(this.perms))
            return interaction.reply({
                embeds: [
                    errorEmbed().setDescription(
                        "Vous ne pouvez pas bannir quelqu'un qui a la permission " +
                            this.permission
                    ),
                ],
                ephemeral: true,
            });

        Target.send({
            embeds: [
                banEmbed().setDescription(
                    "Vous avez été banni du serveur **" +
                        guild.name +
                        "** pour la raison suivante : \n **" +
                        Reason +
                        "**"
                ),
            ],
        }).catch(() => {
            console.log(
                "Je ne peux pas envoyer un message à " + Target.user.tag
            );
        });

        //interaction.reply({embeds : [banEmbed().setDescription(Target + " has been banned by "+ member.user +" from **" + guild.name + "** for **" + Reason + "**")]})

        db.findOne(
            {
                guildID: guild.id,
                userID: Target.id,
            },
            async (err, data) => {
                if (err) throw err;
                if (!data || !data.BanData) {
                    data = new db({
                        GuildID: guild.id,
                        GuildName: guild.name,
                        UserID: Target.id,
                        UserTag: Target.user.tag,
                        BanData: {
                            ExecutorID: member.id,
                            ExecutorTag: member.user.tag,
                            TargetID: Target.id,
                            TargetTag: Target.user.tag,
                            Messages: Amount,
                            Reason: Reason,
                            Data: parseInt(interaction.createdTimestamp / 1000),
                        },
                    });
                } else {
                    const BanDataObject = {
                        ExecutorID: member.id,
                        ExecutorTag: member.user.tag,
                        TargetID: Target.id,
                        TargetTag: Target.user.tag,
                        Messages: Amount,
                        Reason: Reason,
                        Data: parseInt(interaction.createdTimestamp / 1000),
                    };
                    data.BanData.push(BanDataObject);
                }

                data.save();
            }
        );

        interaction.reply({
            embeds: [
                banEmbed().setDescription(
                    Target +
                        " a été bannie pour la raison suivante :\n" +
                        Reason +
                        "\n\n Tous ses messages depuis " +
                        Amount +
                        " jours ont été supprimés"
                ),
            ],
        });
        Target.ban({ days: Amount, reason: Reason }).catch((err) => {
            console.log(err);
        });
    },
};
