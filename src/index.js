import dotenv from "dotenv";
dotenv.config()

import Distube from "distube";
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

loadEvents(client);

client
    .login(process.env.DISCORD_TOKEN)
    .then(()=> {
        loadCommands(client);
    })
    .catch((err) => { console.log(err); });
        
    
    
client.distube = new Distube.default(client, {
    searchSongs: 0,
    emitNewSongOnly: true,
});
