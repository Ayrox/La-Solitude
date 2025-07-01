import dotenv from "dotenv";
dotenv.config();

import { REST } from '@discordjs/rest';
import { Routes } from "discord-api-types/v10";

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

async function cleanupCommands() {
    try {
        console.log('🧹 Nettoyage de toutes les commandes en cours...');
        
        // Nettoyer les commandes globales
        await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), { body: [] });
        console.log('✅ Commandes globales supprimées');
        
        // Nettoyer les commandes par serveur (remplacez par vos guild IDs)
        const guildIds = ['1189631107736375377', '1271820847899828346']; // Ajustez selon vos serveurs
        
        for (const guildId of guildIds) {
            await rest.put(Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, guildId), { body: [] });
            console.log(`✅ Commandes supprimées du serveur ${guildId}`);
        }
        
        console.log('🎉 Nettoyage terminé ! Vous pouvez maintenant redémarrer votre bot.');
        
    } catch (error) {
        console.error('❌ Erreur lors du nettoyage:', error);
    }
}

cleanupCommands();
