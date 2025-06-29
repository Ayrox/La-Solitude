import { DisTube } from "distube";

export const event = {
    name: 'finishSong',
    once: false,

/**
 * @param {DisTube.Queue} queue
 * @param {DisTube.Song} song
 */
    async execute(queue,song) {
        if (!queue) return console.log("La file d'attente est actuellement vide !")

        console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_FINISH_SONG] [INFO] Finished playing a song.`);
        console.log(`La musique est fini - \`${song.name}\` - \`${song.formattedDuration}\`\nDemandé par: ${song.user}`)

    }
}
