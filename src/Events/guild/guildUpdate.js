import { EmbedBuilder } from 'discord.js'

export const event = {
    name: 'guildUpdate',
    once: false,

    execute(oldGuild, newGuild) {
        console.log(`[${new Date().toISOString()}] [EVENT] [GUILD_UPDATE] [INFO] Guild updated:`, oldGuild.name, '->', newGuild.name);
    }
}