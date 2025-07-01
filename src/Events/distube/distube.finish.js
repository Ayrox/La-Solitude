import { DisTube } from "distube";

export const event = {
    name: 'finish',
    once: false,

    /**
     * @param {DisTube.Queue} queue
     */
    async execute(queue) {
        if (!queue) return;

        console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_FINISH] [INFO] Queue finished - all songs played`);
        console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_FINISH] [DEBUG] Autoplay was: ${queue.autoplay ? 'enabled' : 'disabled'}`);
        
        // Nettoyer les ressources
        if (queue.progressUpdateInterval) {
            clearInterval(queue.progressUpdateInterval);
            console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_FINISH] [DEBUG] Progress update interval cleared`);
        }
        
        if (queue.lastPlayerMessage) {
            try {
                // Mettre à jour le dernier message pour indiquer que la queue est terminée
                await queue.lastPlayerMessage.edit({
                    embeds: [{
                        color: 0x666666,
                        title: "🎵 Lecture terminée",
                        description: "Toutes les musiques ont été jouées. La file d'attente est maintenant vide.",
                        footer: { text: queue.autoplay ? "L'autoplay est toujours activé pour les prochaines musiques" : "Utilisez /play pour ajouter des musiques" }
                    }],
                    components: []
                });
                console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_FINISH] [DEBUG] Last player message updated with finish status`);
            } catch (error) {
                console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_FINISH] [WARNING] Couldn't update last message:`, error.message);
            }
        }
        
        // Réinitialiser les propriétés customisées
        queue.lastPlayerMessage = null;
        queue.progressUpdateInterval = null;
    }
};
