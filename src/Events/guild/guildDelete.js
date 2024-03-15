export default {
    
    name: 'guildDelete',
    once: false,

    execute(guild) {

        console.log('--------------------------------------------------------')
        console.log('<3 <3 <3 LE BOT A QUITTE UN SERVEUR <3 <3 <3\n')
        console.log(`NOM : ${guild.name}`)
        console.log(`NOMBRE DE MEMBRES : ${guild.membersCount}`)
        console.log('--------------------------------------------------------')

    }
}