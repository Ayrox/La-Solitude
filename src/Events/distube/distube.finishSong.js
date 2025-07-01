import { DisTube } from "distube";

export const event = {
    name: 'finishSong',
    once: false,

/**
 * @param {DisTube.Queue} queue
 * @param {DisTube.Song} song
 */
    async execute(queue, song) {
        if (!queue) return console.log("La file d'attente est actuellement vide !");

        // Réinitialiser l'état d'autoplay de la chanson précédente
        queue.currentSongIsAutoplay = false;
        console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_FINISH_SONG] [DEBUG] Autoplay status reset for next song`);

        console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_FINISH_SONG] [INFO] Finished playing: ${song.name}`);
        console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_FINISH_SONG] [DEBUG] Autoplay status: ${queue.autoplay}`);
        console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_FINISH_SONG] [DEBUG] Songs remaining in queue: ${queue.songs.length}`);
        console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_FINISH_SONG] [DEBUG] Previous songs: ${queue.previousSongs?.length || 0}`);
        
        if (queue.autoplay) {
            if (queue.songs.length === 0) {
                console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_FINISH_SONG] [INFO] 🎵 Autoplay ENABLED and queue is EMPTY - DisTube should find related songs now!`);
                console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_FINISH_SONG] [DEBUG] Finished song details:`);
                console.log(`  - Name: ${song.name}`);
                console.log(`  - URL: ${song.url}`);
                console.log(`  - Uploader: ${song.uploader?.name || 'Unknown'}`);
                console.log(`  - Duration: ${song.formattedDuration}`);
            } else {
                console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_FINISH_SONG] [INFO] Autoplay enabled but ${queue.songs.length} songs still in queue`);
            }
        } else {
            console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_FINISH_SONG] [INFO] Autoplay is DISABLED - no automatic songs will be added`);
        }
        
        // Attendre un peu et vérifier si quelque chose s'est passé
        setTimeout(() => {
            if (queue && queue.autoplay && queue.songs.length === 0) {
                console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_FINISH_SONG] [WARNING] ⚠️  Autoplay was enabled but no songs were added after 3 seconds!`);
                console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_FINISH_SONG] [WARNING] This might indicate an issue with YouTube recommendations`);
            } else if (queue && queue.autoplay && queue.songs.length > 0) {
                console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_FINISH_SONG] [SUCCESS] 🎉 Autoplay worked! ${queue.songs.length} songs now in queue`);
            }
        }, 3000);
    }
}
