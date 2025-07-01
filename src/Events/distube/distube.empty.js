import { DisTube } from "distube";

export const event = {
    name: 'empty',
    once: false,

    /**
     * @param {DisTube.Queue} queue
     */
    async execute(queue) {
        if (!queue) return;

        console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_EMPTY] [INFO] Queue is empty`);
        console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_EMPTY] [DEBUG] Autoplay status:`, queue.autoplay);
        
        if (queue.autoplay) {
            console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_EMPTY] [INFO] Autoplay is enabled, DisTube should find related songs automatically`);
        } else {
            console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_EMPTY] [INFO] Autoplay is disabled, queue will remain empty`);
        }
    }
};
