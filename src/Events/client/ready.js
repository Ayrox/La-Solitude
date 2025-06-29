import mongoose from "mongoose"
import db from "../../Models/infraction.js"
const database = process.env.DATABASE
import { loadCommands } from "../../Handlers/Commands.js";

export const event = {
    name: 'ready',
    once: true,

    async execute(client) { // rendre la fonction async et attendre le chargement des commandes
        await loadCommands(client);
        var memberCount = client.users.cache.size;
        var guildCount = client.guilds.cache.size;
        
        console.log("--------------------------------------\n");
        console.log(`${client.user.username} est prêt !\n`);
        //console.log(`[!] Le préfix actuelle: ${process.env.PREFIX}`)
        console.log(`[!] Nombre de serveurs: ${guildCount}`)
        console.log(`[!] Nombre total de membres: ${memberCount}`);
        console.log(`[!] Nombre de commandes initialisées: ${client.commands.size}`);
        console.log("\n--------------------------------------");



        if (!database) return console.log("MongoDB's link is not set");

        try {
            await mongoose.connect(database, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log("\nThe client is now connected to the database !\n");

            const data = await db.find({ MuteData: { $exists: true } }).exec();
            if (data.length === 0) {
                console.log("No data found");
            } else {
                for (const infraction of data) {
                    // Traiter chaque infraction si nécessaire
                    const { Duration, Date: MuteDate } = infraction.MuteData;
                    const Now = new Date();
                    // ... logique ici ...
                }
            }
        } catch (err) {
            console.error(err);
        }
        return;
        
    }
}