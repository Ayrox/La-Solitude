import { Client } from "discord.js"
import ascii from 'ascii-table';
import fs from "fs";

/**
 * 
 * @param {Client} client 
 * @returns 
 */
export function loadEvents(client){
    const table = new ascii().setHeading("Events", "Status");
    console.log(process.cwd())
    const folders = fs.readdirSync(`${process.cwd()}/src/Events`)
    for (const folder of folders){
        const files = fs
            .readdirSync(`${process.cwd()}/src/Events/${folder}`)
            .filter((file) => file.endsWith('.js'));
            
        for (const file of files){
            const event = import(`file://${process.cwd()}/src/Events/${folder}/${file}`);

            if(event.rest){
                if(event.once)
                    client.rest.once(event.name, (...args) =>
                        event.execute(...args, client)
                    );
                else 
                    client.rest.on(event.name, (...args) =>
                        event.execute(...args, client)
                    );
                
            } else {
                if (event.once)
                    client.once(event.name, (...args) =>
                        event.execute(...args, client)
                    );
                else 
                    client.on(event.name, (...args) =>
                        event.execute(...args, client)
                    );
            }
            table.addRow(file,"🟩");
            continue;
        }
    }
    return console.log(table.toString(), "\nLoaded Events")
}
