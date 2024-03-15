const { getVoiceConnection } from "@discordjs/voice");
const { successEmbed, errorEmbed } from "../../util/Embeds");
const { SlashCommandBuilder } from "discord.js");

export default {
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Quitte le salon vocal"),

    async execute(message) {
        if (!message.member.voice.channel)
            return message.reply({
                embeds: [
                    errorEmbed().setDescription(
                        `Vous devez d'abord rejoindre le salon vocal où le BOT se trouve de préférence.`
                    ),
                ],
                ephemeral: true,
            });

        if (!message.guild.members.me.voice.channel)
            return message.reply({
                embeds: [
                    errorEmbed().setDescription(
                        `Le Bot n'est pas connecter dans un salon vocal`
                    ),
                ],
                ephemeral: true,
            });

        if (
            message.guild.members.me.voice.channel.id !==
            message.member.voice.channel.id
        )
            return message.reply({
                ephemeral: true,
                embeds: [
                    errorEmbed().setDescription(
                        `Vous n'êtes pas dans le même salon que le bot.`
                    ),
                ],
            });

        const connection = getVoiceConnection(message.guild.id, "default");
        connection.destroy();

        message.reply({
            embeds: [
                {
                    color: 0x25e325,
                    description: "👋 **SALAM**",
                },
            ],
            ephemeral: true,
        });
    },
};
