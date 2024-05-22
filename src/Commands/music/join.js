import { joinVoiceChannel } from "@discordjs/voice";
import * as Embed from "../../util/Embeds.js";
 
import { CommandInteraction, SlashCommandBuilder } from "discord.js"

export const command = {
    data: new SlashCommandBuilder()
        .setName("join")
        .setDescription("Rejoins le salon vocal"),

    /**
     * 
     * @param {CommandInteraction} message 
     */
    async execute(message, client) {
        var channel = message.member.voice.channel;
        //bot.emit('guildMemberAdd', message.member || await message.guild.fetchMember(message.author));
        if (channel) {
            if(message.guild.members.me.voice.channel){
                if(message.guild.members.me.voice.channel.id === channel.id) return message.reply({
                    embeds: [
                        Embed.errorEmbed().setDescription(
                            `Je suis déjà là !`
                        ),
                    ],
                    ephemeral: true,
                });
            }
            joinVoiceChannel({
                channelId: channel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
            });

            if (joinVoiceChannel) {
                message.reply({
                    embeds: [
                        Embed.successEmbed().setDescription(
                            `Coucou ! 🖐️\nJ'ai rejoins le channel **🔈${channel.name}**`
                        ),
                    ],
                    ephemeral: true,
                });
            }
        } else {
            message.reply({
                embeds: [
                    Embed.errorEmbed().setDescription(
                        `Vous devez d'abord rejoindre un salon vocal !`
                    ),
                ],
                ephemeral: true,
            });
        }
    },
};
