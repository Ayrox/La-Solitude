import dotenv from "dotenv";
dotenv.config()

console.log("🔍 Importation des modules...");

import { DisTube } from "distube";
import { YouTubePlugin } from "@distube/youtube";
import { SpotifyPlugin } from "@distube/spotify";
import fs from "fs";
import path from "node:path";

import { loadEvents } from "./Handlers/Events.js";
import { loadCommands } from "./Handlers/Commands.js";

import { Client, GatewayIntentBits, Partials, Collection, EmbedBuilder } from "discord.js";

const {Guilds, GuildMembers, GuildMessages, GuildVoiceStates} = GatewayIntentBits
const {User, Message, GuildMember, ThreadMember} = Partials

const client = new Client({ 
    intents: [Guilds, GuildMembers, GuildMessages, GuildVoiceStates],
    partials: [User, Message, GuildMember, ThreadMember] 
});

client.commands = new Collection()
client.events = new Collection()

// Fonction pour initialiser DisTube
function initializeDistube(client) {
    try {
        console.log("🎵 Initialisation de DisTube...");
        
        client.distube = new DisTube(client, {
            plugins: [
                new YouTubePlugin(),
                new SpotifyPlugin()
            ],
            emitNewSongOnly: true,
            savePreviousSongs: true,
            nsfw: false,
            ffmpeg: {
                path: "ffmpeg",
            },
        });
        
        console.log("✅ DisTube a été initialisé avec succès.");
        console.log("🔧 Configuration DisTube : autoplay supporté nativement, options validées");
        console.log("🎵 Support Spotify activé");
        console.log("📋 Propriétés du client après DisTube:", Object.keys(client).filter(key => key.includes('distube')));
        
        return true;
    } catch (error) {
        console.error("❌ Erreur lors de l'initialisation de DisTube :", error);
        console.error("Stack trace:", error.stack);
        return false;
    }
}

try {
    await loadEvents(client);
    console.log(`[${new Date().toISOString()}] [SYSTEM] [INIT] [INFO] ✅ Les événements ont été chargés avec succès.`);
} catch (error) {
    console.error(`[${new Date().toISOString()}] [SYSTEM] [INIT] [ERROR] Erreur lors du chargement des événements :`, error);
}

client
    .login(process.env.DISCORD_TOKEN)
    .then(async () => {
        console.log("✅ Connexion réussie au client Discord.");
        
        // Initialiser DisTube après la connexion
        const distubeInitialized = initializeDistube(client);
        
        if (distubeInitialized) {
            console.log("✅ DisTube confirmé après connexion");
        } else {
            console.error("❌ DisTube non disponible après connexion!");
        }
    })
    .catch((err) => {
        console.error("❌ Erreur lors de la connexion au client Discord :", err);
    });
