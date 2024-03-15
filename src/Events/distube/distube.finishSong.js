import { DisTube } from "distube";


export default {
    
    name: 'finishSong',
    once: false,

    
/**
 * @param {DisTube.Queue} queue
 * @param {DisTube.Song} song
 */
    async execute(queue,song) {
        if (!queue) return console.log("La file d'attente est actuellement vide !")

        console.log(`La musique est fini - \`${song.name}\` - \`${song.formattedDuration}\`\nDemandé par: ${song.user}`)

    }
}
