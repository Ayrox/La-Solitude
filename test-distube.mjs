// Test simple d'importation DisTube
console.log("🔍 Test d'importation...");

try {
    const Distube = await import("distube");
    console.log("✅ DisTube importé:", typeof Distube);
    console.log("✅ DisTube default:", typeof Distube.default);
    console.log("✅ DisTube keys:", Object.keys(Distube));
    
    const { YouTubePlugin } = await import("@distube/youtube");
    console.log("✅ YouTubePlugin importé:", typeof YouTubePlugin);
    
    const { Client, GatewayIntentBits, Partials } = await import("discord.js");
    console.log("✅ Discord.js importé");
    
    // Test de création client
    const testClient = new Client({ 
        intents: [GatewayIntentBits.Guilds],
        partials: [] 
    });
    console.log("✅ Client test créé");
    
    // Test d'initialisation DisTube
    console.log("🔄 Test d'initialisation DisTube...");
    const DisTubeClass = Distube.default || Distube;
    const testDistube = new DisTubeClass(testClient, {
        plugins: [new YouTubePlugin()],
    });
    console.log("✅ DisTube test créé:", typeof testDistube);
    
} catch (error) {
    console.error("❌ Erreur dans le test:", error);
    console.error("❌ Stack:", error.stack);
}
