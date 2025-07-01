import { DisTube } from "distube";

export const event = {
    name: 'noRelated',
    once: false,

    /**
     * @param {DisTube.Queue} queue
     */
    async execute(queue) {
        if (!queue) return;

        console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_NO_RELATED] [WARNING] ❌ No related songs found for autoplay!`);
        console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_NO_RELATED] [DEBUG] Queue details:`);
        console.log(`  - Autoplay enabled: ${queue.autoplay}`);
        console.log(`  - Songs in queue: ${queue.songs.length}`);
        console.log(`  - Previous songs: ${queue.previousSongs?.length || 0}`);
        
        if (queue.previousSongs && queue.previousSongs.length > 0) {
            const lastSong = queue.previousSongs[queue.previousSongs.length - 1];
            console.log(`  - Last played song: ${lastSong.name}`);
            console.log(`  - Last song uploader: ${lastSong.uploader?.name || 'Unknown'}`);
            console.log(`  - Last song URL: ${lastSong.url}`);
        }
        
        console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_NO_RELATED] [INFO] This usually happens with:`);
        console.log(`  • Very new or obscure songs`);
        console.log(`  • Songs without YouTube Music recommendations`);
        console.log(`  • Regional restrictions`);
        console.log(`  • YouTube API issues`);
        
        // Notifier dans le canal de musique
        try {
            const textChannel = queue.textChannel;
            if (textChannel) {
                await textChannel.send({
                    embeds: [{
                        color: 0xff9900,
                        title: "🔍 Autoplay - Aucune recommandation",
                        description: "DisTube n'a trouvé aucune musique similaire à recommander.\n\n" +
                                   "💡 **Suggestions:**\n" +
                                   "• Essayez avec des musiques plus populaires\n" +
                                   "• Ajoutez manuellement des musiques avec `/play`\n" +
                                   "• L'autoplay fonctionne mieux avec des hits connus",
                        footer: { text: "L'autoplay reste activé pour les prochaines musiques" }
                    }]
                });
            }
        } catch (error) {
            console.log(`[${new Date().toISOString()}] [EVENT] [DISTUBE_NO_RELATED] [ERROR] Couldn't send message:`, error.message);
        }
    }
};
