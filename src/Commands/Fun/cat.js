import { EmbedBuilder, CommandInteraction, SlashCommandBuilder } from "discord.js";
import * as Embed from "../../Util/Embeds.js";
 
const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args)); // eslint-disable-line

export const command = {
    data: new SlashCommandBuilder()
        .setName("cat")
        .setDescription("Envoie une image de chat"),

    /**
     *
     * @param {CommandInteraction} message
     */
    async execute(message) {
        try {
            await message.deferReply();

            const fetchAPI = async () => {
                // Essayer plusieurs APIs en fallback
                const apis = [
                    {
                        url: "https://api.thecatapi.com/v1/images/search",
                        parser: (data) => ({ image: data[0].url, fact: "Voici un magnifique chat ! 🐱" })
                    },
                    {
                        url: "https://cataas.com/cat?json=true",
                        parser: (data) => ({ 
                            image: `https://cataas.com${data.url}`, 
                            fact: data.tags ? `Tags: ${data.tags.join(', ')} 🏷️` : "Un chat adorable ! 😸" 
                        })
                    },
                    {
                        url: "https://aws.random.cat/meow",
                        parser: (data) => ({ image: data.file, fact: "Random cat from the internet ! 🌐" })
                    }
                ];

                for (const api of apis) {
                    try {
                        console.log(`[CAT] Tentative avec: ${api.url}`);
                        const response = await fetch(api.url, {
                            method: "GET",
                            timeout: 5000
                        });
                        
                        if (!response.ok) {
                            throw new Error(`HTTP ${response.status}`);
                        }
                        
                        const data = await response.json();
                        const parsed = api.parser(data);
                        console.log(`[CAT] ✅ Succès avec: ${api.url}`);
                        return parsed;
                        
                    } catch (error) {
                        console.log(`[CAT] ❌ Échec avec ${api.url}:`, error.message);
                        continue;
                    }
                }
                
                // Si toutes les APIs échouent, retourner un placeholder
                throw new Error('Toutes les APIs de chats sont indisponibles');
            };

            const data = await fetchAPI();

            const embed = new EmbedBuilder()
                .setTitle("🐱 -- Image de Chat -- 🐱")
                .setColor("#00D7FF")
                .setDescription(data.fact)
                .setImage(data.image)
                .setFooter({
                    text: `Demandé par ${message.member.user.tag}`,
                    iconURL: message.member.displayAvatarURL(),
                })
                .setTimestamp();

            await message.editReply({ embeds: [embed] });
        } catch (error) {
            console.error("❌ Une erreur s'est produite dans la commande 'cat' :", error);
            
            // Fallback avec des images de chats statiques
            const fallbackCats = [
                "https://placekitten.com/400/300",
                "https://placekitten.com/450/350", 
                "https://placekitten.com/500/400",
                "https://placekitten.com/350/250",
                "https://placekitten.com/480/320"
            ];
            
            const fallbackFacts = [
                "Les chats dorment 12 à 16 heures par jour ! 😴",
                "Un chat peut faire plus de 100 sons différents ! 🔊", 
                "Les chats ont une vision nocturne 6 fois meilleure que les humains ! 👁️",
                "Le ronronnement d'un chat aide à la guérison des os ! 🦴",
                "Les chats transpirent uniquement par leurs coussinets ! 🐾",
                "Un chat peut courir jusqu'à 48 km/h ! 💨",
                "Les chats passent 70% de leur vie à dormir ! 💤"
            ];
            
            const randomCat = fallbackCats[Math.floor(Math.random() * fallbackCats.length)];
            const randomFact = fallbackFacts[Math.floor(Math.random() * fallbackFacts.length)];

            const fallbackEmbed = new EmbedBuilder()
                .setTitle("🐱 Image de Chat (Mode Secours)")
                .setColor("#FFA500")
                .setDescription(`${randomFact}\n\n*APIs temporairement indisponibles*`)
                .setImage(randomCat)
                .setFooter({
                    text: `Demandé par ${message.member.user.tag}`,
                    iconURL: message.member.displayAvatarURL(),
                })
                .setTimestamp();

            await message.editReply({ embeds: [fallbackEmbed] });
        }
    },
};
