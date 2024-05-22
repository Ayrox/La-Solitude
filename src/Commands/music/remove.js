import { ActionRowBuilder, BaseSelectMenuBuilder, SlashCommandBuilder } from "discord.js";
import snekfetch from "snekfetch";
const { option } = snekfetch
import * as Embed from "../../util/Embeds.js";
 

export const command = {
    data: new SlashCommandBuilder()
        .setName("remove")
        .setDescription("Supprime une musique de la file d'attente"),

    async execute(message, client) {
        try {
            const queue = client.distube.getQueue(message);
            if (!queue)
                return message.editReply({
                    embeds: [
                        Embed.errorEmbed().setDescription(
                            `La file d'attente est actuellement vide !`
                        ),
                    ],
                    ephemeral: true,
                });
            //numberOfSelectNeeded = math.ceil(queue.songs.length/25)

            //TODO ajouter plusieurs SelectMenu if queue.songs.length-1 >= 25
            //! [EWEN] Si jamais je l'ai deja fait dans le fichier /Commands/Developper/commands.js ligne 84 --> ligne 98

            await message.reply({
                embeds: [Embed.musicEmbed().setDescription("⏳ Chargement ...")],
            });

            const optionMenu = await queue.songs.map((song, i) => {
                return {
                    label: song.name,
                    value: i.toString(),
                };
            });

            const row = new ActionRowBuilder().addComponents(
                new BaseSelectMenuBuilder()
                    .setCustomId("remove")
                    .setMaxValues(1)
                    .setPlaceholder("Sélectionnez une musique à supprimer")
                    .addOptions(optionMenu.slice(0, 24))
            );

            message.editReply({
                embeds: [
                    Embed.musicEmbed().setDescription(
                        `Sélectionner une ou plusieurs musiques à supprimer ci-dessous ⤵️`
                    ),
                ],
                components: [row],
                ephemeral: true,
            });

            //queue.songs.splice(removeNumber, 1)
        } catch (e) {
            console.log(e);
            message.editReply({
                embeds: [Embed.errorEmbed().setDescription(`${e}`)],
                ephemeral: true,
            });
        }
    },
};
