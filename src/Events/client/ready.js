import mongoose from "mongoose"
import db from "../../Models/infraction.js"
const database = process.env.DATABASE

export default {
    
    name: 'ready',
    once: true,

    execute(client) {

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

        mongoose.connect(database, {

            useNewUrlParser: true,
            useUnifiedTopology: true,

        }).then(() => {
            console.log("\nThe client is now connected to the database !\n");
            
            db.find(
                {
                    MuteData: {
                        $exists: true
                    }
                },
                (err, data) => { 
                    if (err) return console.log(err);
                    if (data.length === 0) return console.log("No data found");
                    data.forEach(async (infraction) => {
                        
                        let Duration = infraction.MuteData.Duration;
                        let MuteDate = infraction.MuteData.Date;
                        let Now = new Date();

                        

                    });
                }
            )


        }).catch((err) => {
            console.log(err);
        });
        
    }
}