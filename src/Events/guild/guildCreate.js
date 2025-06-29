export const event = {
    name: 'guildCreate',
    once: false,

    execute(guild) {

        console.log('--------------------------------------------------------')
        console.log(`[${new Date().toISOString()}] [EVENT] [GUILD_CREATE] [INFO] A new guild was created:`, guild.name);
        console.log(`NOM : ${guild.name}`)
        console.log(`NOMBRE DE MEMBRES : ${guild.membersCount}`)
        console.log('--------------------------------------------------------')

    }
}