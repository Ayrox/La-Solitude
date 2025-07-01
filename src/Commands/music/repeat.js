import * as Embed from "../../Util/Embeds.js";
import * as ButtonRow from "../../Util/buttonLayout.js";
import { SlashCommandBuilder } from "discord.js";

export const command = {
    data: new SlashCommandBuilder()
        .setName("repeat")
        .setDescription("Répète la musique en cours")
        .addStringOption((option) =>
            option
                .setName("mode")
                .setDescription(
                    "Choisissez un mode de répétition (Désactiver, Répéter la musique, Répéter la file d'attente)."
                )
                .setRequired(false)
                .addChoices(
                    { name: "Désactiver", value: "0" },
                    { name: "Répéter la musique", value: "1" },
                    { name: "Répéter la file d'attente", value: "2" }
                )
        ),

    name: "repeat",
    description: "Répète la musique en cours",
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

            // Si aucun mode spécifié, faire un cycle automatique
            let modeInput = message.options.getString("mode");
            let newMode;

            if (modeInput === null) {
                // Cycle automatique : 0 -> 1 -> 2 -> 0
                const currentMode = queue.repeatMode;
                newMode = (currentMode + 1) % 3;
            } else {
                newMode = parseInt(modeInput);
            }

            // Appliquer le nouveau mode
            const setMode = queue.setRepeatMode(newMode);
            
            // Déterminer le texte du mode
            let modeText;
            let modeIcon;
            switch (setMode) {
                case 0:
                    modeText = "Désactivé";
                    modeIcon = "🔁";
                    break;
                case 1:
                    modeText = "Répétition de la musique";
                    modeIcon = "🔂";
                    break;
                case 2:
                    modeText = "Répétition de la file d'attente";
                    modeIcon = "🔁";
                    break;
                default:
                    modeText = "Désactivé";
                    modeIcon = "🔁";
            }

            const currentSong = queue.songs[0];
            const embed = Embed.musicEmbed()
                .setTitle(`${modeIcon} | Mode de répétition modifié`)
                .setDescription(`[${currentSong.name}](${currentSong.url})`)
                .setThumbnail(currentSong.thumbnail)
                .addFields(
                    {
                        name: `Modifié par :`,
                        value: `${message.user}`,
                        inline: true
                    },
                    {
                        name: `Mode de répétition :`,
                        value: `${modeIcon} ${modeText}`,
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
            console.error('Erreur dans la commande repeat:', e);
            message.reply({
                embeds: [
                    Embed.errorEmbed().setDescription(
                        `Une erreur est survenue lors de la modification du mode de répétition : ${e.message}`
                    )
                ],
                ephemeral: true,
            });
        }
    },
};
