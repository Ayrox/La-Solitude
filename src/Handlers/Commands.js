import { Client } from "discord.js"
import ascii from 'ascii-table';
import fs from "fs";
import { REST } from '@discordjs/rest';
import { Routes } from "discord-api-types/v10";
import path from "path";
import * as fileLoader from "../util/fileLoader.js";
const { loadFiles } = fileLoader

/**
 * 
 * @param {Client} client 
 * @returns 
 */
export async function loadCommands(client){
    console.log("[DEBUG] Appel de loadCommands()");
    try {
        const table = new ascii().setHeading("Commands", "Status");
        await client.commands.clear();

        let commandsArray = [];
        const FilesRaw = await loadFiles("commands");
        const Files = FilesRaw; // Charger tous les fichiers de commandes, y compris jerem.js

        for (const file of Files) {
            try {
                const { command } = await import(`file://${file}`);
                client.commands.set(command.data.name, command);
                commandsArray.push(command.data.toJSON());
                table.addRow(command.data.name, "🟩");
            } catch (error) {
                console.error(`[${new Date().toISOString()}] [HANDLER] [COMMANDS] [ERROR] Erreur lors de l'importation de la commande depuis le fichier ${file} :`, error);
                table.addRow(file, "❌");
            }
        }

        try {
            // Enregistrement des commandes par serveur avec suppression des doublons
            const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
            
            // Supprimer les commandes globales
            try {
                await rest.put(Routes.applicationCommands(client.application.id), { body: [] });
                console.log(`[${new Date().toISOString()}] [HANDLER] [COMMANDS] [INFO] ✅ Commandes globales supprimées.`);
            } catch (globalError) {
                console.log(`[${new Date().toISOString()}] [HANDLER] [COMMANDS] [WARN] Impossible de supprimer les commandes globales:`, globalError.message);
            }
            
            // Enregistrer uniquement par serveur
            for (const guild of client.guilds.cache.values()) {
                try {
                    await rest.put(
                        Routes.applicationGuildCommands(client.application.id, guild.id),
                        { body: commandsArray }
                    );
                    console.log(`[${new Date().toISOString()}] [HANDLER] [COMMANDS] [INFO] ✅ Commandes enregistrées pour ${guild.name}`);
                } catch (guildError) {
                    console.log(`[${new Date().toISOString()}] [HANDLER] [COMMANDS] [ERROR] Erreur pour ${guild.name}:`, guildError.message);
                }
            }
            
            console.log(`[${new Date().toISOString()}] [HANDLER] [COMMANDS] [INFO] ✅ Processus d'enregistrement terminé.`);
        } catch (error) {
            console.error(`[${new Date().toISOString()}] [HANDLER] [COMMANDS] [ERROR] Erreur lors de l'enregistrement des commandes slash :`, error);
        }

        console.log(table.toString(), "\nCommands Loaded !");
    } catch (error) {
        console.error(`[${new Date().toISOString()}] [HANDLER] [COMMANDS] [ERROR] Erreur lors du chargement des commandes :`, error);
    }
}