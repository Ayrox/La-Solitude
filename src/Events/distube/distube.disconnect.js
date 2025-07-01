import { DisTube } from "distube";

export const event = {
    name: 'disconnect',
    once: false,

    /**
     * @param {DisTube.Queue} queue
     */
    async execute(queue) {
        if (!queue) return;

        console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_DISCONNECT] [INFO] Bot disconnected from voice channel`);
        console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_DISCONNECT] [DEBUG] Queue had ${queue.songs.length} songs`);
        console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_DISCONNECT] [DEBUG] Autoplay was: ${queue.autoplay ? 'enabled' : 'disabled'}`);
        
        // Remettre le statut par défaut du bot
        const client = queue.voiceChannel?.guild?.client;
        if (client && client.setDefaultActivity) {
            client.setDefaultActivity();
            console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_DISCONNECT] [INFO] Rich presence reset to default`);
        }
    }
};
