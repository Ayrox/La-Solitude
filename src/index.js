import dotenv from "dotenv";
dotenv.config()

import Distube from "distube";
import { YouTubePlugin } from "@distube/youtube";
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

// Initialiser DisTube AVANT de charger les événements
try {
    console.log("🔄 Initialisation de DisTube...");
    client.distube = new Distube(client, {
        plugins: [new YouTubePlugin()],
        emitNewSongOnly: true,
        savePreviousSongs: true, // Sauvegarder les musiques précédentes pour le bouton previous
        nsfw: false, // Pas de contenu NSFW
        ffmpeg: {
            path: "ffmpeg", // Chemin vers FFmpeg (dans le PATH)
        },
        ytdlOptions: {
            highWaterMark: 1024 * 1024 * 64, // 64MB buffer
        },
    });
    console.log("✅ Distube a été initialisé avec succès.");
    console.log(`🔧 DisTube attaché au client: ${client.distube ? 'OUI' : 'NON'}`);
    console.log("🔧 Configuration DisTube : autoplay supporté nativement, options validées");
    
    // Test FFmpeg
    console.log("🔍 Test de FFmpeg...");
    const { spawn } = await import('child_process');
    const ffmpegTest = spawn('ffmpeg', ['-version']);
    ffmpegTest.stdout.on('data', (data) => {
        const version = data.toString().split('\n')[0];
        console.log(`✅ FFmpeg détecté: ${version}`);
    });
    ffmpegTest.on('error', (error) => {
        console.error(`❌ Erreur FFmpeg: ${error.message}`);
    });
} catch (error) {
    console.error("❌ Erreur lors de l'initialisation de Distube :", error);
    console.error("❌ Stack trace:", error.stack);
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
        
        // Double vérification de DisTube après connexion
        if (client.distube) {
            console.log("✅ DisTube confirmé après connexion");
        } else {
            console.error("❌ DisTube non disponible après connexion!");
        }
    })
    .catch((err) => {
        console.error("❌ Erreur lors de la connexion au client Discord :", err);
    });
