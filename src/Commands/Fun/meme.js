import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import * as Embed from "../../Util/Embeds.js";
 
const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));
import delay from "delay";

const MAX_MEME = 5;

// Fonction pour récupérer des memes depuis plusieurs sources
async function getMemeFromSources() {
    const sources = [
        // Reddit API
        async () => {
            const response = await fetch("https://www.reddit.com/r/memes/random/.json");
            const data = await response.json();
            
            if (!Array.isArray(data) || !data[0] || !data[0].data || !data[0].data.children) {
                throw new Error('Format Reddit invalide');
            }
            
            const [post] = data[0].data.children;
            const postData = post.data;
            
            return {
                title: postData.title,
                url: `https://reddit.com${postData.permalink}`,
                image: postData.url,
                upvotes: postData.ups || 0,
                comments: postData.num_comments || 0
            };
        },
        
        // API alternative 1
        async () => {
            const response = await fetch("https://meme-api.com/gimme");
            const data = await response.json();
            
            return {
                title: data.title,
                url: data.postLink,
                image: data.url,
                upvotes: data.ups || 0,
                comments: 0
            };
        },
        
        // API alternative 2
        async () => {
            const response = await fetch("https://api.imgflip.com/get_memes");
            const data = await response.json();
            
            if (!data.success || !data.data || !data.data.memes) {
                throw new Error('Imgflip API erreur');
            }
            
            const randomMeme = data.data.memes[Math.floor(Math.random() * data.data.memes.length)];
            
            return {
                title: randomMeme.name,
                url: `https://imgflip.com/i/${randomMeme.id}`,
                image: randomMeme.url,
                upvotes: Math.floor(Math.random() * 1000),
                comments: Math.floor(Math.random() * 100)
            };
        }
    ];

    for (const source of sources) {
        try {
            console.log(`[MEME] Tentative avec source...`);
            const result = await source();
            console.log(`[MEME] ✅ Meme récupéré: ${result.title}`);
            return result;
        } catch (error) {
            console.log(`[MEME] ❌ Source échouée:`, error.message);
            continue;
        }
    }
    
    // Fallback final
    throw new Error('Toutes les sources de memes sont indisponibles');
}

export const command = {
    data: new SlashCommandBuilder()
        .setName("meme")
        .setDescription("Renvoie un meme")
        .addNumberOption((option) =>
            option
                .setName("combien")
                .setDescription(
                    `Combien de meme voulez-vous ? | Maximum : ${MAX_MEME}`
                )
                .setRequired(false)
        ),

    async execute(message) {
        try {
            await message.deferReply();
            
            let memeNumber =
                message.options.getNumber("combien") === null
                    ? 1
                    : Math.floor(message.options.getNumber("combien"));

            if (memeNumber > MAX_MEME || memeNumber <= 0)
                return message.editReply({
                    embeds: [
                        Embed.errorEmbed().setDescription(
                            `Choisissez un nombre entre 1 et ${MAX_MEME}`
                        ),
                    ],
                });

            for (let i = 0; i < memeNumber; i++) {
                try {
                    let messageMeme;

                    // Essayer plusieurs sources de memes
                    let memeData = await getMemeFromSources();
                    
                    let embedReponse = new EmbedBuilder()
                        .setTitle(memeData.title)
                        .setURL(memeData.url)
                        .setColor("Random")
                        .setFooter({text: memeData.upvotes + " Upvotes | " + memeData.comments + " Comments" })
                        .setTimestamp()
                        .setImage(memeData.image);
                        
                    if (i == 0) {
                        messageMeme = await message.editReply({
                            embeds: [embedReponse],
                        });
                    } else {
                        messageMeme = await message.channel.send({
                            embeds: [embedReponse],
                        });
                    }
                    
                    try {
                        await messageMeme.react(
                            message.guild.emojis.cache.find(
                                (emoji) => emoji.name === "upvote"
                            ) || "👍"
                        );
                        await messageMeme.react(
                            message.guild.emojis.cache.find(
                                (emoji) => emoji.name === "downvote"
                            ) || "👎"
                        );
                    } catch (e) {
                        console.log(`[${new Date().toISOString()}] [COMMAND] [MEME] [WARN] Erreur émojis:`, e.message);
                    }
                    
                    if (i < memeNumber - 1) await delay(1000); // Délai entre les memes
                    
                } catch (error) {
                    console.error(`[${new Date().toISOString()}] [COMMAND] [MEME] [ERROR] Erreur meme ${i + 1}:`, error.message);
                    
                    // Fallback pour ce meme
                    const fallbackEmbed = new EmbedBuilder()
                        .setTitle("❌ Meme indisponible")
                        .setDescription("Impossible de récupérer ce meme, désolé !")
                        .setColor("Red")
                        .setTimestamp();
                        
                    if (i == 0) {
                        await message.editReply({ embeds: [fallbackEmbed] });
                    } else {
                        await message.channel.send({ embeds: [fallbackEmbed] });
                    }
                }
            }
        } catch (error) {
            console.error(`[${new Date().toISOString()}] [COMMAND] [MEME] [ERROR] Erreur globale:`, error);
            
            if (message.deferred && !message.replied) {
                await message.editReply({
                    embeds: [
                        Embed.errorEmbed().setDescription("❌ Impossible de récupérer les memes pour le moment. Réessayez plus tard.")
                    ],
                });
            }
        }
    },
};
