import { EmbedBuilder, CommandInteraction, SlashCommandBuilder } from "discord.js";
import * as Embed from "../../util/Embeds.js";
 
const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args)); // eslint-disable-line

export const command = {
    data: new SlashCommandBuilder()
        .setName("dog")
        .setDescription("Envoie une image de chien"),

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
                        url: "https://dog.ceo/api/breeds/image/random",
                        parser: (data) => ({ image: data.message, fact: "Voici un adorable chien ! 🐕" })
                    },
                    {
                        url: "https://api.thedogapi.com/v1/images/search",
                        parser: (data) => ({ image: data[0].url, fact: "Un magnifique chien pour vous ! 🐶" })
                    },
                    {
                        url: "https://random.dog/woof.json",
                        parser: (data) => ({ image: data.url, fact: "Random dog from the internet ! 🌐" })
                    }
                ];

                for (const api of apis) {
                    try {
                        console.log(`[DOG] Tentative avec: ${api.url}`);
                        const response = await fetch(api.url, {
                            method: "GET",
                            timeout: 5000
                        });
                        
                        if (!response.ok) {
                            throw new Error(`HTTP ${response.status}`);
                        }
                        
                        const data = await response.json();
                        const parsed = api.parser(data);
                        console.log(`[DOG] ✅ Succès avec: ${api.url}`);
                        return parsed;
                        
                    } catch (error) {
                        console.log(`[DOG] ❌ Échec avec ${api.url}:`, error.message);
                        continue;
                    }
                }
                
                // Si toutes les APIs échouent, retourner un placeholder
                throw new Error('Toutes les APIs de chiens sont indisponibles');
            };

            const data = await fetchAPI();

            const embed = new EmbedBuilder()
                .setTitle("🐕 -- Image de Chien -- 🐕")
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
            console.error(`[${new Date().toISOString()}] [COMMAND] [DOG] [ERROR] Une erreur s'est produite dans la commande 'dog' :`, error);
            
            // Fallback avec des images de chiens statiques
            const fallbackDogs = [
                "https://place.dog/400/300",
                "https://place.dog/450/350", 
                "https://place.dog/500/400",
                "https://place.dog/350/250",
                "https://place.dog/480/320"
            ];
            
            const fallbackFacts = [
                "Les chiens ont un odorat 10 000 à 100 000 fois plus développé que les humains ! 👃",
                "Un chien peut apprendre plus de 1000 mots ! 🧠", 
                "Les chiens transpirent uniquement par leurs coussinets ! 🐾",
                "Le chien le plus âgé du monde a vécu 29 ans ! 🎂",
                "Les chiens peuvent voir certaines couleurs, pas seulement en noir et blanc ! 🌈",
                "Un chien peut courir jusqu'à 70 km/h (lévrier) ! 💨",
                "Les chiens ont 18 muscles pour bouger leurs oreilles ! 👂"
            ];
            
            const randomDog = fallbackDogs[Math.floor(Math.random() * fallbackDogs.length)];
            const randomFact = fallbackFacts[Math.floor(Math.random() * fallbackFacts.length)];

            const fallbackEmbed = new EmbedBuilder()
                .setTitle("🐕 Image de Chien (Mode Secours)")
                .setColor("#FFA500")
                .setDescription(`${randomFact}\n\n*APIs temporairement indisponibles*`)
                .setImage(randomDog)
                .setFooter({
                    text: `Demandé par ${message.member.user.tag}`,
                    iconURL: message.member.displayAvatarURL(),
                })
                .setTimestamp();

            await message.editReply({ embeds: [fallbackEmbed] });
        }
    },
};
