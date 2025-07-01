import { DisTube } from "distube";

export const event = {
    name: 'initQueue',
    once: false,

    /**
     * @param {DisTube.Queue} queue
     */
    async execute(queue) {
        if (!queue) return;

        console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_INIT_QUEUE] [INFO] ✅ New queue initialized`);
        console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_INIT_QUEUE] [DEBUG] Queue details:`);
        console.log(`  - Guild: ${queue.id}`);
        console.log(`  - Voice channel: ${queue.voiceChannel?.name}`);
        console.log(`  - Text channel: ${queue.textChannel?.name}`);
        console.log(`  - Autoplay: ${queue.autoplay ? 'enabled' : 'disabled'}`);
        console.log(`  - Volume: ${queue.volume}%`);
        console.log(`  - Filter: ${queue.filters.names.join(', ') || 'none'}`);
        
        // Initialiser nos propriétés personnalisées
        queue.lastPlayerMessage = null;
        queue.progressUpdateInterval = null;
        queue.currentSongIsAutoplay = false;
        console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_INIT_QUEUE] [DEBUG] Custom queue properties initialized`);
    }
};
