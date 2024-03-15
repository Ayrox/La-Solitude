const { EmbedBuilder, SlashCommandBuilder } from "discord.js");
const phewist from "../../util/phewistLists");
 
//const config from "../../config.json");

export default {
    data: new SlashCommandBuilder()
        .setName("phewist")
        .setDescription("Générer une phrase que pourrait dire Phewist"),

    async execute(message, client) {
        
        await message.deferReply()
        
        let rndSujet =
            phewist.sujet[Math.floor(Math.random() * phewist.sujet.length)];
            let rndVerbs =
            phewist.verbs[Math.floor(Math.random() * phewist.verbs.length)];
            let rndObjet =
            phewist.objet[Math.floor(Math.random() * phewist.objet.length)];
            
        let phewistID
        try{
            phewistID = await client.users.fetch("178851979332812801").catch();
        }
        catch(e){
            phewistID = null
        }
        

        let phewistEmbed = new EmbedBuilder()
            .setColor("#666699")
            .setDescription(`**Moi, ${rndSujet}, ${rndVerbs} ${rndObjet}.**`)
            .setAuthor({ 
                name : phewistID ? `${phewistID.tag}` : "Phewist",
                iconURL : phewistID
                    ? `${phewistID.avatarURL()}`
                    : "https://cdn.discordapp.com/avatars/178851979332812801/473cdeb49f6293a18b7c449a7774db4c.webp"
            })
            .setTimestamp();

        await message.editReply({ embeds: [phewistEmbed] });
    },
};
