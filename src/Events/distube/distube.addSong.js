import { DisTube } from "distube";

export const event = {
    name: 'addSong',
    once: false,

    /**
     * @param {DisTube.Queue} queue
     * @param {DisTube.Song} song
     */
    async execute(queue, song) {
        if (!queue) return;

        const isAutoplay = !song.member || !song.user;
        console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_ADD_SONG] [INFO] Song added: ${song.name}`);
        console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_ADD_SONG] [DEBUG] Song details:`);
        console.log(`  - Member: ${song.member ? 'Present' : 'NULL'}`);
        console.log(`  - User: ${song.user ? 'Present' : 'NULL'}`);
        console.log(`  - Likely autoplay: ${isAutoplay ? 'YES' : 'NO'}`);
        console.log(`  - Queue autoplay status: ${queue.autoplay}`);
        console.log(`  - Total songs in queue: ${queue.songs.length}`);
        
        // Si la chanson a été ajoutée par autoplay
        if (isAutoplay && queue.autoplay) {
            console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_ADD_SONG] [SUCCESS] 🎉 AUTOPLAY SUCCESS! Song added automatically: ${song.name}`);
            
            // Marquer cette chanson comme étant ajoutée par autoplay
            song._isAutoplayAddition = true;
            console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_ADD_SONG] [DEBUG] Song marked as autoplay addition`);
            
            // Ne pas notifier dans le canal car le lecteur principal l'indiquera déjà
            // Seuls les logs sont nécessaires pour le debug
            
        } else if (!isAutoplay) {
            console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_ADD_SONG] [INFO] Song added manually by user`);
            song._isAutoplayAddition = false;
        } else {
            console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_ADD_SONG] [WARNING] Potential autoplay song but autoplay is disabled?`);
            song._isAutoplayAddition = false;
        }
    }
};
