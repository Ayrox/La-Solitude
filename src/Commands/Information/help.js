 
const {
    CommandInteraction,
    EmbedBuilder,
    Client,
    ActionRowBuilder,
    MessageSelectMenu,
    SlashCommandBuilder
} from "discord.js");
const { log } from "util");
const { errorEmbed } from "../../util/Embeds");

export default {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Affiche la liste des commandes"),

    /**
     *
     *
     * @param {CommandInteraction} message
     * @param {Client} client
     *
     */
    async execute(message, client) {
        /*await message.deferReply();

        const emoji = {
            custom: "✏️",
            developper: "🔧",
            fun: "🎲",
            games: "🎮",
            information: "🔍",
            miscellaneous: "💠",
            moderation: "🔨",
            music: "🎵",
            pokemon: "🐱",
            setup: "⚙️",
        };

        const directories = [
            ...new Set(client.commands.map((c) => c.category)),
        ];

        console.log(directories);

        const formatString = (str) =>
            `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

        const categories = directories.map((d) => {
            const getCommands = client.commands
                .filter((c) => c.category === d)
                .map((cmd) => {
                    return {
                        name: cmd.name || "Il n'y a pas de nom",
                        description:
                            cmd.description || "Il n'y a pas de description",
                    };
                });

            console.log(d);

            return {
                directory: formatString(d),
                commands: getCommands,
                emoji: emoji[d.toLowerCase()] || "🔷",
            };
        });

        const helpEmbed = new EmbedBuilder()
            .setAuthor(
                `${client.user.username} Menu Help`,
                client.user.avatarURL()
            )
            .setColor("#0099ff")
            .setDescription(
                `Sélectionnez une catégorie pour voir les commandes`
            )
            .setFooter(
                `Demandé par ${message.user.tag}`,
                message.member.avatarURL()
            )
            .setTimestamp();

        const components = (state) => {
            return new ActionRowBuilder().addComponents(
                new MessageSelectMenu()
                    .setCustomId("help-menu")
                    .setPlaceholder("Rien n'est sélectionné")
                    .setDisabled(state)
                    .addOptions(
                        categories.map((c) => {
                            return {
                                label: c.directory,
                                value: c.directory.toLowerCase(),
                                description: `Les commandes de la catégorie ${c.directory}`,
                                emoji: emoji[c.directory.toLowerCase()] || "🔷",
                            };
                        })
                    )
            );
        };

        const m = await message.editReply({
            embeds: [helpEmbed],
            components: [components(false)],
        });

        const filter = (interaction) => {
            return interaction.user.id === message.member.id;
        };

        const collector = m.createMessageComponentCollector({
            filter,
            componentType: "SELECT_MENU",
            time: 300000,
        });

        collector.on("collect", async (interaction) => {
            const [directory] = interaction.values;
            const category = categories.find(
                (c) => c.directory.toLowerCase() === directory
            );

            helpEmbed
                .setTitle(
                    `${category.emoji} --- Les commandes ${category.directory} --- ${category.emoji}`
                )
                .setDescription("")
                .setFields(
                    category.commands.map((c) => {
                        return {
                            name: `\`/${c.name}\``,
                            value: c.description,
                        };
                    })
                );

            message.editReply({
                embeds: [helpEmbed],
            });

            await interaction.deferUpdate();
        });

        collector.on("end", async (collected, reason) => {
            m.delete();
        });*/
        message.reply({
            embeds: [
                errorEmbed().setDescription(`Cette commande n'est plus disponible.`),
            ],
            ephemeral: true,
        });
    },
};
