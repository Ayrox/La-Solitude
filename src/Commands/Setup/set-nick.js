const { EmbedBuilder, CommandInteraction, SlashCommandBuilder } from "discord.js");
const { errorEmbed } from "../../util/Embeds");
const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args)); // eslint-disable-line
 

export default {
    //TODO A REFAIRE
    //TODO A REFAIRE
    //TODO A REFAIRE
    //TODO A REFAIRE
    data: new SlashCommandBuilder()
        .setName("set-nick")
        .setDescription("Change le pseudo de quelqu'un")
        .addStringOption(option =>
            option.setName("nickname")
                .setDescription("Le nouveau pseudo")
                .setRequired(true)
        )
        .addUserOption(option => 
            option.setName('member')
                .setDescription("Le membre dont vous voulez changer le pseudo")
                .setRequired(false)
        ),


    /**
     *
     * @param {CommandInteraction} message
     */

    async execute(message) {
        let Target = message.options.getMember("member");
        let newNickname = message.options.getString("nickname");

        if (!Target) Target = message.member;

        oldNickname = Target.nickname ? Target.nickname : Target.user.username;

        //Permission checking

        if (!message.member.permissions.has("CHANGE_NICKNAME"))
            return message.reply({
                embeds: [
                    errorEmbed().setDescription(
                        `Vous n'avez pas la permission de changer de pseudo`
                    ),
                ],
                ephemeral: true,
            });
        if (!message.guild.members.me.permissions.has("MANAGE_NICKNAMES"))
            return message.reply({
                embeds: [
                    errorEmbed().setDescription(
                        `Je n'ai pas la permission de changer de pseudo`
                    ),
                ],
                ephemeral: true,
            });
        if (
            Target.roles.highest.position >
                message.member.roles.highest.position &&
            Target != message.member
        )
            return message.reply({
                embeds: [
                    errorEmbed().setDescription(
                        `Vous ne pouvez pas changer le pseudo d'un membre de rang supérieur à vous`
                    ),
                ],
                ephemeral: true,
            });

        //Nickname checking

        if (newNickname.length > 32)
            return message.reply({
                embeds: [
                    errorEmbed().setDescription(
                        `Le pseudo que vous avez entré est trop long || \`Max : 32 caractères\``
                    ),
                ],
                ephemeral: true,
            });
        if (newNickname.length < 2)
            return message.reply({
                embeds: [
                    errorEmbed().setDescription(
                        `Le pseudo que vous avez entré est trop court|| \`Min : 2 caractères\``
                    ),
                ],
                ephemeral: true,
            });

        //Nickname changing

        await Target.setNickname(newNickname)
            .then(() => {
                message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(
                                `**Le pseudo de ${Target} a été changé** \n\n\`${oldNickname}\` ---> \`${newNickname}\``
                            )
                            .setColor("Green"),
                    ],
                    ephemeral: true,
                });
            })
            .catch((err) => {
                message.reply({
                    embeds: [
                        errorEmbed().setDescription(
                            `Je ne peux pas changer le surnom de ${Target} dù à une erreur survenue lors de l'exécution`
                        ),
                    ],
                    ephemeral: true,
                });
                console.log(err);
            });
    },
};