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
    const table = new ascii().setHeading("Events", "Status");

    await client.events.clear()

    const Files = await loadFiles("Events")

    for (const file of Files) {
        const { event } = await import(`file://${file}`)

        //console.log(event)

        const execute = (...args) => event.execute(...args, client);
        client.events.set(event.name, execute);

        if(event.rest){
            if(event.once) client.rest.once(event.name, execute);
            else client.rest.on(event.name, execute)
        } else {
            if(event.once) client.once(event.name, execute);
            else client.on(event.name, execute)
        }
        
        table.addRow(event.name, "🟩")
    };

    console.log(table.toString(), "\nLoaded Events")
    return;


}
