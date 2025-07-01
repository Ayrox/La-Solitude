import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export const command = {
    data: new SlashCommandBuilder()
        .setName('test-autoplay-songs')
        .setDescription('🧪 [DEBUG] Teste l\'autoplay avec différentes musiques populaires')
        .addStringOption(option => 
            option.setName('type')
                .setDescription('Type de test à effectuer')
                .setRequired(true)
                .addChoices(
                    { name: '🎵 Hits populaires (recommandé)', value: 'popular' },
                    { name: '🎸 Rock classique', value: 'rock' },
                    { name: '🎤 Pop actuelle', value: 'pop' },
                    { name: '🎹 Musique électronique', value: 'electronic' },
                    { name: '🏠 Mix varié', value: 'mixed' }
                )
        ),

    /**
     * @param {import("discord.js").ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        try {
            const { client } = interaction;
            const { channel } = interaction.member.voice;
            const type = interaction.options.getString('type');

            if (!channel) {
                return interaction.reply({
                    embeds: [{
                        color: 0xff0000,
                        title: "❌ Erreur",
                        description: "Vous devez être dans un salon vocal pour utiliser cette commande."
                    }],
                    ephemeral: true
                });
            }

            await interaction.deferReply();

            // Définir les musiques de test selon le type
            const testSongs = {
                popular: [
                    "Shape of You Ed Sheeran",
                    "Blinding Lights The Weeknd",
                    "Bohemian Rhapsody Queen"
                ],
                rock: [
                    "Stairway to Heaven Led Zeppelin",
                    "Hotel California Eagles",
                    "Sweet Child O Mine Guns N Roses"
                ],
                pop: [
                    "Anti-Hero Taylor Swift",
                    "As It Was Harry Styles",
                    "Heat Waves Glass Animals"
                ],
                electronic: [
                    "Levels Avicii",
                    "Titanium David Guetta",
                    "Clarity Zedd"
                ],
                mixed: [
                    "Imagine Dragons - Demons",
                    "Ed Sheeran - Perfect",
                    "Dua Lipa - Levitating"
                ]
            };

            const songsToTest = testSongs[type];
            const typeNames = {
                popular: "🎵 Hits populaires",
                rock: "🎸 Rock classique",
                pop: "🎤 Pop actuelle", 
                electronic: "🎹 Musique électronique",
                mixed: "🏠 Mix varié"
            };

            // Activer l'autoplay
            const queue = client.distube.getQueue(interaction.guildId);
            if (queue) {
                queue.setAutoplay(true);
            }

            console.log(`[${new Date().toISOString()}] [COMMAND] [TEST_AUTOPLAY_SONGS] [INFO] Testing autoplay with ${type} songs`);
            console.log(`[${new Date().toISOString()}] [COMMAND] [TEST_AUTOPLAY_SONGS] [DEBUG] Songs to test:`, songsToTest);

            // Jouer la première musique pour démarrer le test
            try {
                await client.distube.play(channel, songsToTest[0], {
                    member: interaction.member,
                    textChannel: interaction.channel
                });

                await interaction.editReply({
                    embeds: [{
                        color: 0x00ff00,
                        title: "🧪 Test Autoplay - " + typeNames[type],
                        description: `**Test en cours...**\n\n` +
                                   `🎵 **Musique de départ:** ${songsToTest[0]}\n` +
                                   `🔄 **Autoplay:** Activé\n` +
                                   `⏱️ **Durée estimée:** 3-5 minutes\n\n` +
                                   `**Instructions:**\n` +
                                   `1. Attendez que la musique se termine\n` +
                                   `2. Observez si l'autoplay ajoute une recommandation\n` +
                                   `3. Vérifiez les logs dans la console\n\n` +
                                   `**Autres musiques du lot:** ${songsToTest.slice(1).join(', ')}`,
                        footer: { 
                            text: "Regardez les logs dans la console pour plus de détails" 
                        },
                        timestamp: new Date().toISOString()
                    }]
                });

                console.log(`[${new Date().toISOString()}] [COMMAND] [TEST_AUTOPLAY_SONGS] [SUCCESS] Test started with: ${songsToTest[0]}`);

            } catch (error) {
                console.error(`[${new Date().toISOString()}] [COMMAND] [TEST_AUTOPLAY_SONGS] [ERROR] Failed to start test:`, error);
                
                await interaction.editReply({
                    embeds: [{
                        color: 0xff0000,
                        title: "❌ Erreur de test",
                        description: `Impossible de démarrer le test avec la musique: ${songsToTest[0]}\n\n` +
                                   `**Erreur:** ${error.message}\n\n` +
                                   `Essayez avec un autre type de test ou vérifiez votre connexion.`
                    }]
                });
            }

        } catch (error) {
            console.error(`[${new Date().toISOString()}] [COMMAND] [TEST_AUTOPLAY_SONGS] [ERROR] Command execution failed:`, error);
            
            const errorEmbed = {
                color: 0xff0000,
                title: "❌ Erreur",
                description: `Une erreur s'est produite: ${error.message}`
            };

            if (interaction.deferred) {
                await interaction.editReply({ embeds: [errorEmbed] });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    }
};
