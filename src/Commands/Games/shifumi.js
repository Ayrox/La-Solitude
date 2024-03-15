 

const {
    CommandInteraction,
    Client,
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
    SlashCommandBuilder
} from "discord.js");
const { errorEmbed } from "../../util/Embeds");

export default {
    data: new SlashCommandBuilder()
        .setName("shifumi")
        .setDescription("Lance une partie de Pierre-Feuille-Ciseaux")
        .addUserOption((option) =>
            option
                .setName("qui")
                .setDescription(`L'utilisateur que vous voulez défier`)
                .setRequired(true)
        ),
    /**
     *
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        try {
            await interaction.deferReply();
        } catch (e) {
            console.log(e);
        }
        let Target = interaction.options.getMember("qui");
        let Executor = interaction.member;

        if (Executor.id === Target.id)
            return interaction.editReply({
                embeds: [
                    errorEmbed().setDescription(
                        "Vous ne pouvez pas jouer contre toi-même"
                    ),
                ],
                ephemeral: true,
            });

        if (Target.id === client.user.id)
            return interaction.editReply({
                embeds: [
                    errorEmbed().setDescription(
                        "Vous ne pouvez pas jouer contre le Bot"
                    ),
                ],
                ephemeral: true,
            });

        let inviteEmbed = new EmbedBuilder()
            .setTitle(`⚔️ --- SHIFUMI --- ⚔️`)
            .setAuthor({name:"C'est l'heure du...dududu...du...du...Duel !"})
            .setDescription(`${Executor} défie ${Target} au jeu de Shifumi`)
            .setColor("#FFF000")
            .addFields({
                name: "Description",
                value: "Le jeu consiste à décider qui va gagner en faisant un choix entre :\n\n- Pierre (fort contre Ciseaux) \n- Feuille (fort contre Pierre)\n- Ciseaux (fort contre Feuille)"
            });

        let inviteRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("Accepter")
                .setCustomId(`duel-accept`)
                .setStyle("Success"),
            new ButtonBuilder()
                .setLabel("Refuser")
                .setCustomId(`duel-decline`)
                .setStyle("Danger")
        );

        const duelEmbed = new EmbedBuilder()
            .setTitle(
                `⚔️ --- ${interaction.user.username} VS. ${Target.user.username} --- ⚔️`
            )
            .setColor("#FFF000")
            .setDescription(
                "Choisissez entre 🪨 Pierre, 📄 Feuille, ou ✂️ Ciseaux"
            )
            .setFooter({text: "Vous avez 30 secondes pour faire votre choix"})
            .addFields(
                {
                    name: `${Executor.user.username}`,
                    value: "🔴 Non Défini",
                    inline: true,
                },
                { name: `------`, value: "**------**", inline: true },
                {
                    name: `${Target.user.username}`,
                    value: "🔴 Non Défini",
                    inline: true,
                }
            )
            .setTimestamp();

        let duelRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("PIERRE")
                .setCustomId("rock")
                .setStyle("Secondary")
                .setEmoji("🪨"),

            new ButtonBuilder()
                .setLabel("FEUILLE")
                .setCustomId("paper")
                .setStyle("Success")
                .setEmoji("📄"),

            new ButtonBuilder()
                .setLabel("CISEAUX")
                .setCustomId("scissors")
                .setStyle("Primary")
                .setEmoji("✂️")
        );
        let ReplayRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("Rejouer")
                .setCustomId("replay")
                .setStyle("Success")
                .setEmoji("🔁")
        );

        let m = await interaction.editReply({
            embeds: [inviteEmbed],
            components: [inviteRow],
        });

        const acceptCollector = m.createMessageComponentCollector({
            type: "BUTTON",
            time: 30000,
        });

        await acceptCollector.on("collect", async (button) => {
            if (button.user.id === Executor.id) {
                return button.reply({
                    embeds: [
                        errorEmbed().setDescription(
                            "Vous ne pouvez pas accepter votre propre invitation"
                        ),
                    ],
                    ephemeral: true,
                });
            }

            if (button.user.id !== Target.id) {
                return await button.reply({
                    embeds: [
                        errorEmbed().setDescription(
                            "Ce n'est pas une invitation pour vous"
                        ),
                    ],
                    ephemeral: true,
                });
            }

            if (button.customId == "duel-decline") {
                await button.deferUpdate();
                acceptCollector.stop("decline");
                return false;
            }

            await button.deferUpdate();

            await interaction.editReply({
                embeds: [duelEmbed],
                components: [duelRow],
            });

            acceptCollector.stop();

            let ids = new Set();
            ids.add(interaction.user.id);
            ids.add(Target.id);
            let op, auth;

            const btnCollector = m.createMessageComponentCollector({
                type: "BUTTON",
                time: 30000,
            });
            btnCollector.on("collect", async (b) => {
                if (!ids.has(b.user.id))
                    return await button.editReply({
                        content: "Vous n'êtes pas de la partie",
                        ephemeral: true,
                    });
                ids.delete(b.user.id);

                await b.deferUpdate();

                if (b.user.id === Executor.id) {
                    auth = b.customId;

                    duelEmbed.data.fields[0].value = `🟢 Prêt`;

                    await interaction.editReply({
                        embeds: [duelEmbed],
                        components: [duelRow],
                    });
                }

                if (b.user.id === Target.id) {
                    op = b.customId;

                    duelEmbed.data.fields[2].value = `🟢 Prêt`;

                    await interaction.editReply({
                        embeds: [duelEmbed],
                        components: [duelRow],
                    });
                }

                if (ids.size == 0) btnCollector.stop();
            });

            btnCollector.on("end", async (coll, reason) => {
                if (reason === "time") {
                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Délai d'acceptation expiré")
                                .setColor("BLACK")
                                .setDescription(
                                    "Délai expiré \ntemps limite : 30s"
                                ),
                        ],
                        components: [],
                    });
                } else {
                    const winnerMap = {
                        rock: "scissors",
                        scissors: "paper",
                        paper: "rock",
                    };

                    const emojiMap = {
                        rock: "🪨",
                        scissors: "✂️",
                        paper: "📄",
                    };

                    duelEmbed.data.fields[0].value = `${emojiMap[auth]} ${auth}`;
                    duelEmbed.data.fields[2].value = `${emojiMap[op]} ${op}`;
                    duelEmbed.setColor("GREEN");

                    if (op === auth) {
                        duelEmbed.data.fields[1].value = `**Egalité**`;
                    } else if (winnerMap[op] === auth) {
                        duelEmbed.data.fields[1].value = `**${Target} a gagné !**`;
                    } else {
                        duelEmbed.data.fields[1].value = `**${Executor} a gagné**`;
                    }

                    await interaction.editReply({
                        embeds: [duelEmbed],
                        components: [],
                    });

                    // const replayCollector = m.createMessageComponentCollector({
                    //     type: 'BUTTON',
                    //     time: 30000
                    // })

                    // replayCollector.on('collect', async (b) => {
                    //     if (b.customId === 'replay') {
                    //         await b.deferUpdate()
                    //         replayCollector.stop()

                    //         if (b.user.id === Executor.id) {

                    //             this.execute(interaction, client)

                    //         } else if (b.user.id === Target.id) {
                    //             interaction.user = Target
                    //             Target = Executor
                    //             this.execute(interaction, client)
                    //         }

                    //     }
                    // })
                    // replayCollector.on('end', async (coll, reason) => {
                    //     if (reason === 'time') {
                    //         await interaction.editReply({
                    //             embeds: [duelEmbed],
                    //             components: []
                    //         })
                    //     }
                    // })
                }
            });
        });

        await acceptCollector.on("end", async (collected, reason) => {
            if (reason === "time") {
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Délai d'acceptation expiré")
                            .setColor("BLACK")
                            .setDescription(
                                "Délai expiré \ntemps limite : 30s"
                            ),
                    ],
                    components: [],
                });
            } else if (reason === "decline") {
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Invitation refusée")
                            .setAuthor(
                                interaction.user.tag,
                                interaction.user.displayAvatarURL()
                            )
                            .setColor("#C90000")

                            .setDescription(
                                `${Target} a refusé l'invitation de ${Executor} au Shifumi`
                            ),
                    ],
                    components: [],
                });
            }
        });
    },
};
