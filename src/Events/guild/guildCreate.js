export default {
    
    name: 'guildCreate',
    once: false,

    execute(guild) {

        console.log('--------------------------------------------------------')
        console.log('!!!! LE BOT A REJOINT UN NOUVEAU SERVEUR !!!!\n')
        console.log(`NOM : ${guild.name}`)
        console.log(`NOMBRE DE MEMBRES : ${guild.membersCount}`)
        console.log('--------------------------------------------------------')

    }
}