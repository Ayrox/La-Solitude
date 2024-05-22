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
    const table = new ascii().setHeading("Commands", "Status");
    await client.commands.clear();

    let commandsArray = [];
    const Files = await loadFiles("Commands");

    for( const file of Files ){
        const { command } = await import(`file://${file}`)

        client.commands.set(command.data.name, command);

        commandsArray.push(command.data.toJSON());
        table.addRow(command.data.name, "🟩");
    };
    client.application.commands.set(commandsArray);
/*
    const commandsFolders = fs.readdirSync(path.resolve(`${process.cwd()}/src/Commands`))

    for (const folder of commandsFolders) {
        const commandFiles = fs
            .readdirSync(path.resolve(`${process.cwd()}/src/Commands/${folder}`))
            .filter((file) => file.endsWith(".js"))

        for (const file of commandFiles) {
            const { command } = await import(`file://${process.cwd()}/src/Commands/${folder}/${file}`);
            const commandFile = command;
            client.commands.set(commandFile.data.name, commandFile);

            if(commandFile.developer) 
                developerArray.push(commandFile.data.toJSON())
            else
                commandsArray.push(commandFile.data.toJSON())
            
            table.addRow(file, "🟩");
            continue;

        }
    }
    console.log(client.user.id)
    const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
    (async () => {
        try {
            console.log("Started refreshing application (/) commands    .");

            await rest.put(
                Routes.applicationCommands(client.user.id),
                {
                    body: commandsArray,
                }
            );

            console.log("Successfully reloaded application (/) commands .");
        } catch (error) {
            console.error(error);
        }
    })();

    /*const developerGuild = client.guilds.cache.get(process.env.DEV_GUILD);

    developerGuild.commands.set(developerArray);*/

    return console.log(table.toString(), "\nCommands Loaded !")
}
