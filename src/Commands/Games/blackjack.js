 

const {
    CommandInteraction,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    Client,
    SlashCommandBuilder
} from "discord.js");
const { errorEmbed } from "../../util/Embeds");

export default {
    data: new SlashCommandBuilder()
        .setName("blackjack")
        .setDescription("Lance une partie de Blackjack"),

    /**
     *
     *
     * @param {CommandInteraction} message
     * @param {Client} client
     *
     */
    async execute(message, client) {
        let blackjackEmbed = new EmbedBuilder()
            .setTitle("🎲 -- Blackjack -- 🎲")
            .setDescription("Vous voulez faire une partie de blackjack ?")
            .setColor("#0099ff")
            .setFooter({ text:"Blackjack" })
            .setTimestamp();

        let inviteRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("Oui")
                .setCustomId(`BJ-accept`)
                .setStyle("Success"),
            new ButtonBuilder()
                .setLabel("Non")
                .setCustomId(`BJ-decline`)
                .setStyle("Danger")
        );

        let blackjackRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("Piocher")
                .setCustomId(`BJ-draw`)
                .setStyle("Success")
                .setEmoji("🎴"),

            new ButtonBuilder()
                .setLabel("Rester")
                .setCustomId(`BJ-stay`)
                .setStyle("Secondary")
                .setEmoji("💤"),
            new ButtonBuilder()
                .setLabel("Abandonner")
                .setCustomId(`BJ-abandon`)
                .setStyle("Danger")
                .setEmoji("🏳️")
        );

        await message.deferReply();

        let blackjack = await message.editReply({
            embeds: [blackjackEmbed],
            components: [inviteRow],
        });

        const acceptCollector = blackjack.createMessageComponentCollector({
            type: "BUTTON",
            time: 30000,
        });

        acceptCollector.on("collect", async (btn) => {
            if (btn.user.id !== message.member.id) {
                return await btn.reply({
                    embeds: [
                        errorEmbed().setDescription(
                            "Vous ne pouvez pas intéragir car ce n'est pas votre partie"
                        ),
                    ],
                    ephemeral: true,
                });
            }

            if (btn.customId === "BJ-decline") {
                return await blackjack.delete();
            }

            acceptCollector.stop();
            await btn.deferUpdate();

            let playerHand = [DrawCard(), DrawCard()];
            let botHand = [];

            /**
             * @param {Array} deck
             * @returns {Number}
             */

            blackjackEmbed.description =
                "\n**[Voir les Règles](https://fr.wikipedia.org/wiki/Blackjack_(jeu))**";
            blackjackEmbed.addFields(
                { name: "- Votre Main -", value: "-", inline: true },
                {
                    name: `- ( ${Score(playerHand)} ) - SCORE - ( ${Score(
                        botHand
                    )} ) -`,
                    value: "--------------------------",
                    inline: true,
                },
                { name: "- Main du bot -", value: "-", inline: true }
            );

            blackjackEmbed.data.fields[0].value = `\`${playerHand[0].number} ${playerHand[0].icon}\` | \`${playerHand[1].number} ${playerHand[1].icon}\``;

            await message.editReply({
                embeds: [blackjackEmbed],
                components: [blackjackRow],
            });

            const blackjackCollector =
                blackjack.createMessageComponentCollector({
                    type: "BUTTON",
                    time: 300000,
                });

            blackjackCollector.on("collect", async (btn) => {
                if (btn.user.id !== message.member.id) {
                    return await btn.reply({
                        embeds: [
                            errorEmbed().setDescription(
                                "Vous ne pouvez pas intéragir car ce n'est pas votre partie"
                            ),
                        ],
                        ephemeral: true,
                    });
                }

                await btn.deferUpdate();

                if (btn.customId === "BJ-abandon") {
                    blackjackCollector.stop("abandon");
                    return await blackjack.delete();
                }

                if (btn.customId === "BJ-draw") {
                    playerHand.push(DrawCard());

                    blackjackEmbed.data.fields[0].value = "";
                    playerHand.forEach((card) => {
                        blackjackEmbed.data.fields[0].value += `\`${card.number} ${card.icon}\` | `;
                    });
                    blackjackEmbed.data.fields[0].value =
                        "" + blackjackEmbed.data.fields[0].value.slice(0, -2);

                    blackjackEmbed.data.fields[1].name = `- ( ${Score(
                        playerHand
                    )} ) - SCORE - ( ${Score(botHand)} ) -`;
                }

                if (btn.customId === "BJ-stay") {
                    return blackjackCollector.stop("stay");
                }

                /*if (Score(playerHand) = 21 && playerHand.length === 2) { 
                    
                    blackjackRow.components[0].setDisabled(true)
                    blackjackRow.components[1].setDisabled(true)
                    blackjackRow.components[2].setDisabled(true)


                    blackjackCollector.stop("blackjack")
                }*/

                if (Score(playerHand) > 21) {
                    blackjackRow.components[0].setDisabled(true);
                    blackjackRow.components[1].setDisabled(true);
                    blackjackRow.components[2].setDisabled(true);
                    blackjackEmbed.data.fields[1].value = "Vous avez perdu !";

                    blackjackCollector.stop("lose");
                }

                return blackjack.edit({
                    embeds: [blackjackEmbed],
                    components: [blackjackRow],
                });
            });

            blackjackCollector.on("end", async (collected, reason) => {
                switch (reason) {
                    case "stay":
                        while (Score(botHand) < 17) {
                            botHand.push(DrawCard());

                            blackjackEmbed.data.fields[2].value = "";

                            botHand.forEach((card) => {
                                blackjackEmbed.data.fields[2].value += `\`${card.number} ${card.icon}\` | `;
                            });

                            blackjackEmbed.data.fields[2].value =
                                "" +
                                blackjackEmbed.data.fields[2].value.slice(0, -2);

                            blackjackEmbed.data.fields[1].name = `- ( ${Score(
                                playerHand
                            )} ) - SCORE - ( ${Score(botHand)} ) -`;
                        }

                        if (Score(botHand) > 21) {
                            blackjackEmbed.data.fields[1].value =
                                "Vous avez gagné !";
                        } else if (Score(botHand) > Score(playerHand)) {
                            blackjackEmbed.data.fields[1].value =
                                "Vous avez perdu !";
                        } else if (Score(botHand) === Score(playerHand)) {
                            blackjackEmbed.data.fields[1].value = "Egalité !";
                        } else {
                            blackjackEmbed.data.fields[1].value =
                                "Vous avez gagné !";
                        }

                        blackjack.edit({
                            embeds: [blackjackEmbed],
                            components: [],
                        });

                        break;

                    case "blackjack":
                        break;
                    case "lose":
                        blackjack.edit({
                            embeds: [blackjackEmbed],
                            components: [],
                        });

                        break;

                    case "time":
                        await blackjack.edit({
                            embeds: [
                                errorEmbed().setDescription(
                                    "Vous n'avez pas répondu dans le temps imparti"
                                ),
                            ],
                            components: [],
                        });
                        break;
                }
            });
        });

        acceptCollector.on("end", async (collected, reason) => {
            if (reason === "time") {
                await blackjack.edit({
                    embeds: [
                        errorEmbed().setDescription(
                            "Vous n'avez pas répondu dans le temps imparti"
                        ),
                    ],
                    components: [],
                });
            }
        });
    },
};

function DrawCard() {
    let icon = ["♦️", "♠️", "♣️", "♥️"];
    let number = [
        "A",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "J",
        "Q",
        "K",
    ];
    let card = Math.floor(Math.random() * 13);
    let suit = Math.floor(Math.random() * 4);

    return {
        icon: icon[suit],
        number: number[card],
        index: card,
    };
}

function Score(deck) {
    let score = 0;

    deck.forEach((card) => {
        if (card.number === "A") {
            score + 11 > 21 ? (score += 1) : (score += 11);
        }

        score += card.index > 9 ? 10 : card.index + 1;
    });

    return score;
}
