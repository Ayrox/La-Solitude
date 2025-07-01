import { DisTube } from "distube";

export const event = {
    name: 'deleteQueue',
    once: false,

    /**
     * @param {DisTube.Queue} queue
     */
    async execute(queue) {
        if (!queue) return;

        console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_DELETE_QUEUE] [INFO] 🗑️ Queue deleted`);
        console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_DELETE_QUEUE] [DEBUG] Final queue state:`);
        console.log(`  - Guild: ${queue.id}`);
        console.log(`  - Songs played: ${queue.previousSongs?.length || 0}`);
        console.log(`  - Autoplay was: ${queue.autoplay ? 'enabled' : 'disabled'}`);
        console.log(`  - Reason: Queue finished or manually stopped`);
        
        // Nettoyer les ressources si elles existent encore
        if (queue.progressUpdateInterval) {
            clearInterval(queue.progressUpdateInterval);
            console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_DELETE_QUEUE] [DEBUG] Cleaned up progress interval`);
        }
        
        if (queue.lastPlayerMessage) {
            console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_DELETE_QUEUE] [DEBUG] Last player message will be kept for reference`);
        }
    }
};
