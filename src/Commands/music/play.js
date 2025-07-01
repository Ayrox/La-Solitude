import { ChatInputCommandInteraction, Client, Message, SlashCommandBuilder } from "discord.js";
import { joinVoiceChannel } from "@discordjs/voice";
import * as Embed from "../../Util/Embeds.js";
import * as ButtonRow from "../../Util/buttonLayout.js";
 

export const command = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription(
            "Joue une musique ou une playlist depuis Youtube ou une URL"
        )
        .addStringOption((option) =>
            option
                .setName("musique")
                .setDescription("url ou nom de la musique a jouer")
                .setRequired(true)
        ),
    
    /**
     * 
     * @param {ChatInputCommandInteraction} message 
     * @param {Client} client 
     * @returns 
     */
    async execute(message, client) {
        // Déférer la réponse immédiatement pour éviter l'expiration
        await message.deferReply();

        const { channel } = message.member.voice;
        let addedSong

        if (!channel)
            return message.editReply({
                embeds: [
                    Embed.errorEmbed().setDescription(
                        `Vous devez rejoindre un salon vocal !`
                    ),
                ],
            });

        const music = message.options.getString("musique");
        if (music == "") return message.editReply({
            embeds: [Embed.errorEmbed().setDescription("Veuillez spécifier une musique à jouer.")],
        });

        /*await joinVoiceChannel({
            channelId: channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
        });*/

        if (music.startsWith("http")) {
            try {
                await client.distube.play(channel, music, {
                    textChannel: message.channel,
                    member: message.member
                });
                const queue = client.distube.getQueue(message);
                let numberSongs = queue.songs.length - 1;
                addedSong = queue.songs[numberSongs];
            } catch (e) {
                console.log(e);
                message.editReply({
                    embeds: [Embed.errorEmbed().setDescription(`${e}`)],
                });
                return;
            }
        } else {
            try { 
                // Utiliser directement client.distube.play avec le terme de recherche
                await client.distube.play(channel, music, {
                    textChannel: message.channel,
                    member: message.member
                });
                
                const queue = client.distube.getQueue(message);
                let numberSongs = queue.songs.length - 1;
                addedSong = queue.songs[numberSongs];
            } catch (e) {
                console.log(e);
                message.editReply({
                    embeds: [Embed.errorEmbed().setDescription(`${e}`)],
                });
                return;
            }
        }

        try {
            if (!addedSong) {
                message.editReply({
                    embeds: [Embed.errorEmbed().setDescription("Erreur lors de la récupération des informations de la musique.")],
                });
                return;
            }

            message.editReply({
                embeds: [
                    Embed.musicEmbed()
                        .setTitle(
                            `▶️ | Une musique a été ajouté à la file d'attente : `
                        )
                        .setDescription(`[${addedSong.name}](${addedSong.url})`)
                        .setThumbnail(`${addedSong.thumbnail}`)
                        .addFields(
                            {
                                name: `Demandé par :`,
                                value: `${message.user} `,
                                inline: true
                            },
                            {
                                name: `Auteur :`,
                                value: `[${addedSong.uploader.name}](${addedSong.uploader.url})`,
                                inline: true
                            },
                            {
                                name: `Durée :`,
                                value: `${addedSong.formattedDuration}`,
                                inline: true
                            }
                        ),
                ],
                components: [ButtonRow.musicButtonRow(), ButtonRow.musicButtonRow2()],
            });
        } catch (e) {
            console.log(e);
            message.editReply({
                embeds: [Embed.errorEmbed().setDescription(`${e}`)],
            });
        }
    },
};
