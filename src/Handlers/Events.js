import { Client } from "discord.js"
import ascii from 'ascii-table';
import fs from "fs";
import * as fileLoader from "../Util/fileLoader.js";
const { loadFiles } = fileLoader
/**
 * 
 * @param {Client} client 
 * @returns 
 */
export async function loadEvents(client){
    try {
        const table = new ascii().setHeading("Events", "Status");

        await client.events.clear();

        const Files = await loadFiles("Events");

        for (const file of Files) {
            try {
                const { event } = await import(`file://${file}`);

                const execute = (...args) => event.execute(...args, client);
                client.events.set(event.name, execute);

                if (event.rest) {
                    if (event.once) client.rest.once(event.name, execute);
                    else client.rest.on(event.name, execute);
                } else {
                    if (event.once) client.once(event.name, execute);
                    else client.on(event.name, execute);
                }

                table.addRow(event.name, "🟩");
            } catch (error) {
                console.error(`❌ Erreur lors de l'importation de l'événement depuis le fichier ${file} :`, error);
                table.addRow(file, "❌");
            }
        }

        // Updated console.log for better formatting
        console.log(`[${new Date().toISOString()}] [EVENTS] [LOAD] [INFO] ${table.toString()} \nLoaded Events`);
    } catch (error) {
        // Updated console.error for better formatting
        console.error(`[${new Date().toISOString()}] [EVENTS] [LOAD] [ERROR] Erreur lors du chargement des événements :`, error);
    }
}
