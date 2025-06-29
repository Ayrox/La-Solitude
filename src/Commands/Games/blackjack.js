import {
    CommandInteraction,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    Client,
    SlashCommandBuilder
} from "discord.js";

export const command = {
    data: new SlashCommandBuilder()
        .setName("blackjack")
        .setDescription("Lance une partie de Blackjack"),

    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const player = interaction.user;

        try {
            let initialMessage = null;
            let currentCollector = null;

            // Variables de jeu
            let playerCards = [];
            let dealerCards = [];
            let playerScore = 0;
            let dealerScore = 0;
            let gameEnded = false;

            // Fonction pour créer les boutons de jeu
            function createGameButtons() {
                return new ActionRowBuilder().addComponents(
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
            }

            // Fonction pour créer les boutons de replay
            function createReplayButtons() {
                return new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel("Rejouer")
                        .setCustomId(`BJ-replay`)
                        .setStyle("Primary")
                        .setEmoji("🎲"),
                    new ButtonBuilder()
                        .setLabel("Terminer")
                        .setCustomId(`BJ-end`)
                        .setStyle("Secondary")
                        .setEmoji("🚪")
                );
            }

            // Fonction pour calculer le score
            function calcScore(cards) {
                let score = 0;
                let aces = 0;
                
                for (let card of cards) {
                    if (card.value === 1) {
                        aces++;
                        score += 11;
                    } else {
                        score += card.value;
                    }
                }
                
                while (score > 21 && aces > 0) {
                    score -= 10;
                    aces--;
                }
                
                return score;
            }

            // Fonction pour piocher une carte
            function piocherCarte() {
                const suits = ['♠️', '♣️', '♥️', '♦️'];
                const values = [
                    { name: 'A', value: 1 },
                    { name: '2', value: 2 }, { name: '3', value: 3 }, { name: '4', value: 4 },
                    { name: '5', value: 5 }, { name: '6', value: 6 }, { name: '7', value: 7 },
                    { name: '8', value: 8 }, { name: '9', value: 9 }, { name: '10', value: 10 },
                    { name: 'J', value: 10 }, { name: 'Q', value: 10 }, { name: 'K', value: 10 }
                ];
                
                const suit = suits[Math.floor(Math.random() * suits.length)];
                const val = values[Math.floor(Math.random() * values.length)];
                
                return {
                    name: val.name,
                    value: val.value,
                    suit: suit,
                    emoji: `${val.name}${suit}`
                };
            }

            // Fonction pour gérer le blackjack naturel
            async function handleNaturalBlackjack(embed) {
                dealerScore = calcScore(dealerCards);
                
                // Mettre à jour les champs avec toutes les cartes révélées
                embed.data.fields[0].value = playerCards.map(c => c.emoji).join(' ');
                embed.data.fields[1].name = `${playerScore} : SCORE : ${dealerScore}`;
                embed.data.fields[2].value = dealerCards.map(c => c.emoji).join(' ');
                
                if (dealerScore === 21) {
                    embed.data.fields[1].value = "🤝 **ÉGALITÉ !** (Double Blackjack)";
                    embed.setColor("#FFA500");
                } else {
                    embed.data.fields[1].value = "🎉 **BLACKJACK ! VOUS GAGNEZ !**";
                    embed.setColor("#00FF00");
                }
                
                gameEnded = true;
                await initialMessage.edit({
                    embeds: [embed],
                    components: [createReplayButtons()]
                });
                
                return createReplayCollector();
            }

            // Fonction pour révéler les cartes du croupier avec animation
            async function revealDealerCards(embed) {
                // D'abord révéler toutes les cartes du croupier (2 cartes initiales)
                embed.data.fields[0].value = playerCards.map(c => c.emoji).join(' ');
                embed.data.fields[1].name = `${playerScore} : SCORE : ${dealerScore}`;
                embed.data.fields[2].value = dealerCards.map(c => c.emoji).join(' ');
                
                await initialMessage.edit({ embeds: [embed], components: [] });
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Le croupier tire des cartes tant qu'il a moins de 17
                while (dealerScore < 17) {
                    const newCard = piocherCarte();
                    dealerCards.push(newCard);
                    dealerScore = calcScore(dealerCards);
                    
                    embed.data.fields[0].value = playerCards.map(c => c.emoji).join(' ');
                    embed.data.fields[1].name = `${playerScore} : SCORE : ${dealerScore}`;
                    embed.data.fields[2].value = dealerCards.map(c => c.emoji).join(' ');
                    
                    await initialMessage.edit({ embeds: [embed], components: [] });
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                
                // Déterminer le résultat
                let resultText = "";
                if (dealerScore > 21) {
                    resultText = "🎉 **VOUS GAGNEZ !** (Le croupier dépasse 21)";
                    embed.setColor("#00FF00");
                } else if (dealerScore > playerScore) {
                    resultText = "😢 **VOUS PERDEZ !**";
                    embed.setColor("#FF0000");
                } else if (playerScore > dealerScore) {
                    resultText = "🎉 **VOUS GAGNEZ !**";
                    embed.setColor("#00FF00");
                } else {
                    resultText = "🤝 **ÉGALITÉ !**";
                    embed.setColor("#FFA500");
                }
                
                embed.data.fields[1].name = `${playerScore} : SCORE : ${dealerScore}`;
                embed.data.fields[1].value = resultText;
                gameEnded = true;
                
                await initialMessage.edit({
                    embeds: [embed],
                    components: [createReplayButtons()]
                });
                
                return createReplayCollector();
            }

            // Fonction pour créer le collector des boutons de jeu
            function createGameCollector() {
                if (currentCollector) {
                    currentCollector.stop();
                }
                
                currentCollector = initialMessage.createMessageComponentCollector({
                    filter: (i) => i.user.id === player.id && i.customId.startsWith('BJ-'),
                    time: 300000
                });

                currentCollector.on('collect', async (i) => {
                    if (gameEnded) return;
                    
                    try {
                        await i.deferUpdate();
                        
                        if (i.customId === 'BJ-draw') {
                            // Piocher une carte
                            const newCard = piocherCarte();
                            playerCards.push(newCard);
                            playerScore = calcScore(playerCards);
                            
                            const embed = new EmbedBuilder()
                                .setTitle("🎰 Blackjack")
                                .setColor("Blue")
                                .addFields(
                                    { name: "🎴 Votre Main", value: playerCards.map(c => c.emoji).join(' '), inline: true },
                                    { name: `${playerScore} : SCORE : 🔍...`, value: "────────────────", inline: true },
                                    { name: "🤖 Main du Croupier", value: `${dealerCards[0].emoji} 🎴`, inline: true }
                                )
                                .setFooter({ text: `Joueur: ${player.username}`, iconURL: player.displayAvatarURL() });
                            
                            if (playerScore > 21) {
                                // Joueur dépasse 21
                                embed.data.fields[0].value = playerCards.map(c => c.emoji).join(' ');
                                embed.data.fields[1].name = `${playerScore} : SCORE : ${calcScore(dealerCards)}`;
                                embed.data.fields[1].value = "😢 **VOUS PERDEZ !** (Dépassement de 21)";
                                embed.data.fields[2].value = dealerCards.map(c => c.emoji).join(' ');
                                embed.setColor("#FF0000");
                                gameEnded = true;
                                
                                // Arrêter le collector actuel
                                if (currentCollector) {
                                    currentCollector.stop();
                                }
                                
                                await initialMessage.edit({
                                    embeds: [embed],
                                    components: [createReplayButtons()]
                                });
                                return createReplayCollector();
                            } else {
                                await initialMessage.edit({
                                    embeds: [embed],
                                    components: [createGameButtons()]
                                });
                            }
                            
                        } else if (i.customId === 'BJ-stay') {
                            // Rester - révéler les cartes du croupier
                            const embed = new EmbedBuilder()
                                .setTitle("🎰 Blackjack")
                                .setColor("Blue")
                                .addFields(
                                    { name: "🎴 Votre Main", value: playerCards.map(c => c.emoji).join(' '), inline: true },
                                    { name: `${playerScore} : SCORE : ${dealerScore}`, value: "────────────────", inline: true },
                                    { name: "🤖 Main du Croupier", value: dealerCards.map(c => c.emoji).join(' '), inline: true }
                                )
                                .setFooter({ text: `Joueur: ${player.username}`, iconURL: player.displayAvatarURL() });
                            
                            // Arrêter le collector actuel avant de révéler les cartes
                            if (currentCollector) {
                                currentCollector.stop();
                            }
                            
                            return await revealDealerCards(embed);
                            
                        } else if (i.customId === 'BJ-abandon') {
                            // Abandonner
                            const embed = new EmbedBuilder()
                                .setTitle("🎰 Blackjack")
                                .setColor("#FF0000")
                                .addFields(
                                    { name: "🎴 Votre Main", value: playerCards.map(c => c.emoji).join(' '), inline: true },
                                    { name: `${playerScore} : SCORE : ${dealerScore}`, value: "🏳️ **VOUS ABANDONNEZ !**", inline: true },
                                    { name: "🤖 Main du Croupier", value: dealerCards.map(c => c.emoji).join(' '), inline: true }
                                )
                                .setFooter({ text: `Joueur: ${player.username}`, iconURL: player.displayAvatarURL() });
                            
                            gameEnded = true;
                            
                            // Arrêter le collector actuel
                            if (currentCollector) {
                                currentCollector.stop();
                            }
                            
                            await initialMessage.edit({
                                embeds: [embed],
                                components: [createReplayButtons()]
                            });
                            return createReplayCollector();
                        }
                    } catch (error) {
                        console.error('Erreur dans le collector de jeu:', error);
                    }
                });

                currentCollector.on('end', () => {
                    if (!gameEnded) {
                        initialMessage.edit({ components: [] }).catch(console.error);
                    }
                });
            }

            // Fonction pour créer le collector des boutons de replay
            function createReplayCollector() {
                if (currentCollector) {
                    currentCollector.stop();
                }
                
                currentCollector = initialMessage.createMessageComponentCollector({
                    filter: (i) => i.user.id === player.id && (i.customId === 'BJ-replay' || i.customId === 'BJ-end'),
                    time: 300000
                });

                currentCollector.on('collect', async (i) => {
                    try {
                        await i.deferUpdate();
                        
                        if (i.customId === 'BJ-replay') {
                            // Arrêter le collector actuel avant de redémarrer
                            if (currentCollector) {
                                currentCollector.stop();
                            }
                            return await startNewGame();
                        } else if (i.customId === 'BJ-end') {
                            const embed = new EmbedBuilder()
                                .setTitle("🎰 Blackjack")
                                .setColor("Grey")
                                .setDescription("Merci d'avoir joué au Blackjack ! 🎲")
                                .setFooter({ text: `Joueur: ${player.username}`, iconURL: player.displayAvatarURL() });
                            
                            await initialMessage.edit({
                                embeds: [embed],
                                components: []
                            });
                            if (currentCollector) {
                                currentCollector.stop();
                            }
                        }
                    } catch (error) {
                        console.error('Erreur dans le collector de replay:', error);
                    }
                });

                currentCollector.on('end', () => {
                    // Nettoyer si nécessaire
                });
            }

            // Fonction pour démarrer une nouvelle partie
            async function startNewGame() {
                // Réinitialiser les variables de jeu
                playerCards = [];
                dealerCards = [];
                playerScore = 0;
                dealerScore = 0;
                gameEnded = false;

                // Piocher les cartes initiales
                playerCards.push(piocherCarte());
                playerCards.push(piocherCarte());
                dealerCards.push(piocherCarte());
                dealerCards.push(piocherCarte());

                // Calculer les scores
                playerScore = calcScore(playerCards);
                dealerScore = calcScore(dealerCards);

                // Créer l'embed initial
                const gameEmbed = new EmbedBuilder()
                    .setTitle("🎰 Blackjack")
                    .setColor("Blue")
                    .addFields(
                        { name: "🎴 Votre Main", value: playerCards.map(c => c.emoji).join(' '), inline: true },
                        { name: `${playerScore} : SCORE : 🔍...`, value: "────────────────", inline: true },
                        { name: "🤖 Main du Croupier", value: `${dealerCards[0].emoji} 🎴`, inline: true }
                    )
                    .setFooter({ text: `Joueur: ${player.username}`, iconURL: player.displayAvatarURL() });

                // Vérifier si le joueur a un blackjack naturel
                if (playerScore === 21) {
                    return await handleNaturalBlackjack(gameEmbed);
                }

                // Envoyer ou mettre à jour le message avec les boutons de jeu
                if (initialMessage) {
                    await initialMessage.edit({ 
                        embeds: [gameEmbed], 
                        components: [createGameButtons()] 
                    });
                } else {
                    initialMessage = await interaction.reply({ 
                        embeds: [gameEmbed], 
                        components: [createGameButtons()] 
                    });
                }

                // Créer le collector pour les boutons de jeu
                return createGameCollector();
            }

            // Démarrer la première partie
            await startNewGame();

        } catch (error) {
            console.error('Erreur dans la commande blackjack:', error);
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Erreur')
                .setDescription('Une erreur est survenue lors du lancement du Blackjack.');

            if (interaction.replied) {
                await interaction.editReply({ embeds: [errorEmbed], components: [] });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    },
};
