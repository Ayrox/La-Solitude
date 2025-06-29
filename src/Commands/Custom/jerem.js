import { EmbedBuilder, SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

// Messages aléatoires pour accompagner l'image
const baldMessages = [
    "Un Jérémie sauvage apparaît !",
];

// Termes de recherche pour Google Images
const searchTerms = [
    "homme chauve barbu",
    "bald man with beard",
    "chauve souriant barbu",
    "bald guy beard",
    "homme sans cheveux barbu",
    "crâne chauve barbu",
    "tête chauve barbu",
    "bald head beard"
];

// Fonction pour rechercher des images via Google Custom Search API
async function searchBaldImage() {
    try {
        const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
        const startIndex = Math.floor(Math.random() * 91) + 1; // Pour avoir jusqu'à 200 résultats
        
        // Clés API Google (à configurer dans votre .env)
        const apiKey = process.env.GOOGLE_API_KEY;
        const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
        
        if (!apiKey || !searchEngineId) {
            console.log('[JEREM] ⚠️  Clés API Google manquantes dans .env');
            throw new Error('API keys manquantes');
        }
        
        const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(randomTerm)}&searchType=image&start=${startIndex}&num=10&safe=active&imgSize=medium`;
        
        console.log(`[JEREM] 🔍 Recherche Google: "${randomTerm}" (index ${startIndex})`);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[JEREM] Erreur détaillée Google API:`, {
                status: response.status,
                statusText: response.statusText,
                body: errorText,
                url: url.replace(apiKey, 'HIDDEN_API_KEY')
            });
            throw new Error(`Erreur API Google: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.items.length);
            const selectedImage = data.items[randomIndex];
            console.log(`[JEREM] ✅ Image trouvée: ${selectedImage.link}`);
            return selectedImage.link;
        }
        
        throw new Error('Aucune image trouvée dans les résultats');
        
    } catch (error) {
        console.error('[JEREM] ❌ Erreur recherche Google:', error.message);
        
        // Fallback: utiliser This Person Does Not Exist
        const fallbackUrl = `https://thispersondoesnotexist.com/image?${Date.now()}`;
        console.log(`[JEREM] 🔄 Fallback vers: ${fallbackUrl}`);
        return fallbackUrl;
    }
}

// Statistiques aléatoires pour rendre ça plus amusant
const getRandomStats = () => ({
    calvitie: Math.floor(Math.random() * 100) + 1,
    brillance: Math.floor(Math.random() * 100) + 1,
    aerodynamisme: Math.floor(Math.random() * 100) + 1
});

export const command = {
    data: new SlashCommandBuilder()
        .setName("jerem")
        .setDescription("Fait spawn un jérémie sauvage"),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        try {
            // Différer la réponse car on va faire une recherche Google
            await interaction.deferReply();

            // Rechercher une vraie image de chauve sur Google
            const imageUrl = await searchBaldImage();
            
            // Sélectionner un message aléatoire
            const randomMessage = baldMessages[Math.floor(Math.random() * baldMessages.length)];
            const stats = getRandomStats();
            
            const embed = new EmbedBuilder()
                .setTitle(`🦲 Un Jérémie sauvage apparaît!`)
                .setDescription(randomMessage)
                .setImage(imageUrl)
                .setColor(0xff6800)
                .addFields(
                    { name: '📊 Niveau de Calvitie', value: `${stats.calvitie}/100`, inline: true },
                    { name: '✨ Brillance', value: `${stats.brillance}/100`, inline: true },
                    { name: '💨 Aérodynamisme', value: `${stats.aerodynamisme}/100`, inline: true }
                )
                .setFooter({ text: 'Jérémie sauvage • Recherche Google Images' })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('[JEREM COMMAND] Erreur:', error);
            const fallbackEmbed = new EmbedBuilder()
                .setTitle('❌ Erreur')
                .setDescription('Jérémie est trop chauve pour apparaître maintenant!')
                .setColor(0xff0000);
            
            if (interaction.deferred) {
                await interaction.editReply({ embeds: [fallbackEmbed] });
            } else {
                await interaction.reply({ embeds: [fallbackEmbed], ephemeral: true });
            }
        }
    },
};
