import { EmbedBuilder, CommandInteraction, Client, ChatInputCommandInteraction } from "discord.js";
import * as Embed from "../../util/Embeds.js"; 

export const event = {
    name: "interactionCreate",

    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     * @returns
     */
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;
        
        console.log(`${interaction.guild} => #${interaction.channel.name} => ${interaction.user.username} => use command : /${interaction.commandName}`);
        
        const command = client.commands.get(interaction.commandName);
        //console.info(client.commands);
        console.log(command)
        if (!command) return console.log("Commande non trouvée");

        //if(command.dev && interaction.user.id !== "206905331366756353");

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
                        Embed.musicEmbed().setDescription(
                            `${interaction.user} a supprimé la musique [${queue.songs[songId].name}](${queue.songs[songId].url}) de la file d'attente`
                        ),
                    ],
                });

                interaction.message.delete();
                //interaction.message.resolveComponent(interaction.customId).setDisabled(true) //!wtf pk ca marche pas
            } catch (e) {
                console.error(e);
                interaction.editReply({
                    embeds: [Embed.errorEmbed().setDescription(`ALED : \n${e}`)],
                    ephemeral: true,
                });
            }
        }
    },
};
