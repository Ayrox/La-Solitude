import * as Embed from "../../util/Embeds.js";
import * as ButtonRow from "../../util/buttonLayout.js";
import { SlashCommandBuilder } from "discord.js";

export const command = {
    data: new SlashCommandBuilder()
        .setName("volume")
        .setDescription("Change le volume de la musique")
        .addIntegerOption((option) =>
            option
                .setName("pourcentage")
                .setDescription("Volume entre 0 et 100% (par défaut 50%)")
                .setRequired(false)
                .setMinValue(0)
                .setMaxValue(100)
        ),

    name: "volume",
    description: "Change le volume de la musique",
    permission: "ADMINISTRATOR",
    active: true,

    async execute(message, client) {
        try {
            // Vérifier si l'utilisateur est dans un canal vocal
            if (!message.member.voice.channel) {
                return message.reply({
                    embeds: [
                        Embed.errorEmbed().setDescription(
                            `Vous devez être dans un canal vocal pour utiliser cette commande !`
                        ),
                    ],
                    ephemeral: true,
                });
            }

            // Récupérer la queue
            const queue = client.distube.getQueue(message);
            if (!queue) {
                return message.reply({
                    embeds: [
                        Embed.errorEmbed().setDescription(
                            `Aucune musique n'est actuellement en cours de lecture !`
                        ),
                    ],
                    ephemeral: true,
                });
            }

            // Récupérer le volume demandé ou afficher le volume actuel
            const volumeInput = message.options.getInteger("pourcentage");
            
            if (volumeInput === null) {
                // Afficher le volume actuel si aucun paramètre
                const currentSong = queue.songs[0];
                const embed = Embed.musicEmbed()
                    .setTitle(`🔊 | Volume actuel`)
                    .setDescription(`[${currentSong.name}](${currentSong.url})`)
                    .setThumbnail(currentSong.thumbnail)
                    .addFields(
                        {
                            name: `Demandé par :`,
                            value: `${message.user}`,
                            inline: true
                        },
                        {
                            name: `Volume actuel :`,
                            value: `🔊 ${queue.volume}%`,
                            inline: true
                        },
                        {
                            name: `Statut :`,
                            value: `${queue.playing ? '▶️ En cours' : '⏸️ En pause'}`,
                            inline: true
                        }
                    );

                return message.reply({
                    embeds: [embed],
                    components: [ButtonRow.musicButtonRow(), ButtonRow.musicButtonRow2()],
                });
            }

            // Valider le volume
            if (volumeInput < 0 || volumeInput > 100) {
                return message.reply({
                    embeds: [
                        Embed.errorEmbed().setDescription(
                            `Le volume doit être compris entre 0% et 100% !`
                        ),
                    ],
                    ephemeral: true,
                });
            }

            // Appliquer le nouveau volume
            const oldVolume = queue.volume;
            queue.setVolume(volumeInput);

            // Déterminer l'icône selon le niveau de volume
            let volumeIcon;
            if (volumeInput === 0) {
                volumeIcon = "🔇";
            } else if (volumeInput < 30) {
                volumeIcon = "🔈";
            } else if (volumeInput < 70) {
                volumeIcon = "🔉";
            } else {
                volumeIcon = "🔊";
            }

            const currentSong = queue.songs[0];
            const embed = Embed.musicEmbed()
                .setTitle(`${volumeIcon} | Volume modifié`)
                .setDescription(`[${currentSong.name}](${currentSong.url})`)
                .setThumbnail(currentSong.thumbnail)
                .addFields(
                    {
                        name: `Modifié par :`,
                        value: `${message.user}`,
                        inline: true
                    },
                    {
                        name: `Volume :`,
                        value: `${oldVolume}% ➜ ${volumeIcon} ${volumeInput}%`,
                        inline: true
                    },
                    {
                        name: `Statut :`,
                        value: `${queue.playing ? '▶️ En cours' : '⏸️ En pause'}`,
                        inline: true
                    }
                );

            await message.reply({
                embeds: [embed],
                components: [ButtonRow.musicButtonRow(), ButtonRow.musicButtonRow2()],
            });

        } catch (e) {
            console.error('Erreur dans la commande volume:', e);
            message.reply({
                embeds: [
                    Embed.errorEmbed().setDescription(
                        `Une erreur est survenue lors de la modification du volume : ${e.message}`
                    )
                ],
                ephemeral: true,
            });
        }
    },
};
