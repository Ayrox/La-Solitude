import { Client } from "discord.js"
import ascii from 'ascii-table';
import fs from "fs";
import { REST } from '@discordjs/rest';
import { Routes } from "discord-api-types/v10";
import path from "path";
import * as fileLoader from "../Util/fileLoader.js";
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
            await client.application.commands.set(commandsArray);

            // Enregistrement immédiat des slash commands par serveur
            const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
            for (const guild of client.guilds.cache.values()) {
                await rest.put(
                    Routes.applicationGuildCommands(client.application.id, guild.id),
                    { body: commandsArray }
                );
            }
            console.log(`[${new Date().toISOString()}] [HANDLER] [COMMANDS] [INFO] ✅ Les commandes slash ont été enregistrées avec succès dans chaque serveur.`);
        } catch (error) {
            console.error(`[${new Date().toISOString()}] [HANDLER] [COMMANDS] [ERROR] Erreur lors de l'enregistrement des commandes slash :`, error);
        }

        console.log(table.toString(), "\nCommands Loaded !");
    } catch (error) {
        console.error(`[${new Date().toISOString()}] [HANDLER] [COMMANDS] [ERROR] Erreur lors du chargement des commandes :`, error);
    }
}