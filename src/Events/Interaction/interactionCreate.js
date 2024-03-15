import { EmbedBuilder, CommandInteraction, Client } from "discord.js";
import { musicEmbed, errorEmbed } from "../../util/Embeds.js"; //!provisoir, a retirer quand Handler pour Select menu sera présent

export default {
    name: "interactionCreate",

    /**
     *
     * @param {CommandInteraction} interaction
     * @param {Client} client
     * @returns
     */
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;
        console.log(
            `${interaction.guild} => #${interaction.channel.name} => ${interaction.user.username} => use command : /${interaction.commandName}`
        );
        const command = client.commands.get(interaction.commandName);
        //console.info(client.commands);
        if (!command) return console.log("commande non trouvée");

        try {
            await command.execute(interaction, client);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: "There was an error while executing this command!",
                ephemeral: true,
            });
        }
        if (interaction.isStringSelectMenu()) {
            //TODO a modifer/mettre en place un handler pour les SelectMenu
            try {
                if (interaction.customId !== "remove") return;
                await interaction.deferReply();
                const queue = client.distube.getQueue(interaction);
                const songId = interaction.values[0];
                queue.songs.splice(songId, 1);

                await interaction.followUp({
                    embeds: [
                        musicEmbed().setDescription(
                            `${interaction.user} a supprimé la musique [${queue.songs[songId].name}](${queue.songs[songId].url}) de la file d'attente`
                        ),
                    ],
                });

                interaction.message.delete();
                //interaction.message.resolveComponent(interaction.customId).setDisabled(true) //!wtf pk ca marche pas
            } catch (e) {
                console.error(e);
                interaction.editReply({
                    embeds: [errorEmbed().setDescription(`ALED : \n${e}`)],
                    ephemeral: true,
                });
            }
        }
    },
};
