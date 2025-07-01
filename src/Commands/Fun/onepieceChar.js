import delay from "delay";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { EmbedBuilder, SlashCommandBuilder, CommandInteraction } from "discord.js";
import * as Embed from "../../Util/Embeds.js";
import { toCapitalize } from "../../util/functions.js";

const OP = await require('../../util/OnePieceData.json');

export const command = {
    data: new SlashCommandBuilder()
        .setName("onepiece-char")
        .setDescription("Créer un personnage de One Piece avec des caractéristiques aléatoires"),

    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        try {
            const TIMER = 1000;

            await interaction.reply({embeds:[Embed.OnePieceEmbed(interaction.member.user.username)]});

        const side = OP.side[Math.floor(Math.random() * OP.side.length)];
        const grade = OP.level[side][Math.floor(Math.random() * OP.level[side].length)];
        const race = OP.races[Math.floor(Math.random() * OP.races.length)]; 
        const Intelligence = OP.smartLevel[Math.floor(Math.random() * OP.smartLevel.length)];
        const Force = OP.strenghLevel[Math.floor(Math.random() * OP.strenghLevel.length)];
        const Vitesse = OP.speedLevel[Math.floor(Math.random() * OP.speedLevel.length)]; 
        const Region = OP.originRegion[Math.floor(Math.random() * OP.originRegion.length)]
        let OPEmbed = Embed.OnePieceEmbed(interaction.member.user.username)
        let prime = Intelligence.point + Force.point + Vitesse.point + grade.point
        
        let color, fruit;
        let eveille = false;
        let haki = [];
        let primeName = ""

        switch (side) {
            case "pirate":
                color = 0xFF0000
                primeName = " par la Marine"
                break;
            case "marine":
                color = 0x0000FF
                primeName = " par Baggy"
                break;
            case "Révolutionnaire":
                color = 0xFF7F00
                break;
        }
        if(Math.random()*3>2){  // fruit ?
            if(Math.random()*10>8){ //Smile ?
                if(Math.random()*10>5){  // Worked?
                    fruit= {
                        nameFR: (OP.smileNames && OP.smileNames.length > 0) ? 
                            OP.smileNames[Math.floor(Math.random() * OP.smileNames.length)] : 
                            "SMILE Mystérieux",
                        nameJP: "",
                        type: "SMILE",
                        imgURL: OP.smileImgURL || "https://static.wikia.nocookie.net/onepiece/images/f/f7/Smile_Infobox.png",
                        wikiURL: OP.smileWikiURL || "https://onepiece.fandom.com/fr/wiki/SMILE"
                        
                    }
                    prime += 50
                } else { // Smile défectueux
                    fruit= {
                        nameFR: "SMILE Défectueux",
                        nameJP: "",
                        type: "SMILE",
                        imgURL: OP.noSmileURL || "https://static.wikia.nocookie.net/onepiece/images/f/f7/Smile_Infobox.png",
                        wikiURL: OP.smileWikiURL || "https://onepiece.fandom.com/fr/wiki/SMILE"
                    }
                    prime = prime / 2
                }
            } else { // a un fruit 
                
                fruit = (OP["demon-fruit"] && OP["demon-fruit"].length > 0) ? 
                    OP["demon-fruit"][Math.floor(Math.random() * OP["demon-fruit"].length)] : 
                    {
                        nameFR: "Fruit du Démon Mystérieux",
                        nameJP: "Nazo Nazo no Mi",
                        type: "Paramecia",
                        imgURL: "https://static.wikia.nocookie.net/onepiece/images/4/4c/Devil_Fruit_Infobox.png",
                        wikiURL: "https://onepiece.fandom.com/fr/wiki/Fruit_du_D%C3%A9mon"
                    };
                prime += 100
                
                if(Math.random()*10>7) // éveillé ?
                    eveille = true
                    prime += 200

            }

        } else {  //pas de fruit
            fruit = false
        }

        if(Math.random()*4>3){ // Haki Armement?
            let rnd = Math.floor(Math.random()*5)
            const masteryName = (OP.masteryLevel && OP.masteryLevel[rnd]) ? 
                OP.masteryLevel[rnd] : 
                ["Débutant", "Novice", "Intermédiaire", "Avancé", "Maître"][rnd] || "Inconnu";
            haki.push(`${masteryName} - Haki de l'Armement`)
            prime += 10 * (rnd + 1)
        }
        if(Math.random()*4>3){ // Haki Observation?
            let rnd = Math.floor(Math.random()*5)
            const masteryName = (OP.masteryLevel && OP.masteryLevel[rnd]) ? 
                OP.masteryLevel[rnd] : 
                ["Débutant", "Novice", "Intermédiaire", "Avancé", "Maître"][rnd] || "Inconnu";
            haki.push(`${masteryName} - Haki de l'Observation`)
            prime += 25 * (rnd + 1)
        }
        if(Math.random()*4>3){ // Haki Roi ?
            let rnd = Math.floor(Math.random()*5)
            const masteryName = (OP.masteryLevel && OP.masteryLevel[rnd]) ? 
                OP.masteryLevel[rnd] : 
                ["Débutant", "Novice", "Intermédiaire", "Avancé", "Maître"][rnd] || "Inconnu";
            haki.push(`${masteryName} - Haki des Rois`)
            prime += 50 * (rnd + 1)
        }
        
        await delay(TIMER)                                               //? GRADE
        if (OPEmbed.data.fields && OPEmbed.data.fields[0]) {
            OPEmbed.data.fields[0].value = `${grade.name || "Inconnu"}`
        }
        
        if (OPEmbed.data.fields && OPEmbed.data.fields[1]) {
            OPEmbed.data.fields[1].value = `${toCapitalize(side)}`      //? SIDE
        }
        OPEmbed.data.color = color
        await interaction.editReply({embeds: [OPEmbed]})
    
        await delay(TIMER)                                               //? RACE
        if (OPEmbed.data.fields && OPEmbed.data.fields[2]) {
            OPEmbed.data.fields[2].value = `[${race.name || "Inconnu"}](${race.url || "https://onepiece.fandom.com/fr/wiki/Race"})`
        }
        await interaction.editReply({embeds: [OPEmbed]})

        await delay(TIMER)                                               //? REGION
        if (OPEmbed.data.fields && OPEmbed.data.fields[3]) {
            OPEmbed.data.fields[3].value = Region
        }
        await interaction.editReply({embeds: [OPEmbed]})

        await delay(TIMER)                                               //? FORCE
        if (OPEmbed.data.fields && OPEmbed.data.fields[4]) {
            OPEmbed.data.fields[4].value = Force.name || "Inconnu"
        }
        await interaction.editReply({embeds: [OPEmbed]})
        
        await delay(TIMER)                                               //? INTELLIGENCE
        if (OPEmbed.data.fields && OPEmbed.data.fields[5]) {
            OPEmbed.data.fields[5].value = Intelligence.name || "Inconnu"
        }
        await interaction.editReply({embeds: [OPEmbed]})
        
        await delay(TIMER)                                               //? VITESSE
        if (OPEmbed.data.fields && OPEmbed.data.fields[6]) {
            OPEmbed.data.fields[6].value = Vitesse.name || "Inconnu"
        }
        await interaction.editReply({embeds: [OPEmbed]})
        
        await delay(TIMER)                                               //? HAKI
        var s = ""
        if (haki.length == 0){
            s = "❌"
        } else {
            s = ""
            haki.forEach(h => {
                s += h + "\n"
            })
        }
        if (OPEmbed.data.fields && OPEmbed.data.fields[7]) {
            OPEmbed.data.fields[7].value = s
        }
        await interaction.editReply({embeds: [OPEmbed]})

        await delay(TIMER)                                               //? FRUIT
        if (OPEmbed.data.fields && OPEmbed.data.fields[8]) {
            if (!fruit){
                OPEmbed.data.fields[8].value = `❌`
            } else {
                OPEmbed.data.fields[8].value = `[${fruit.nameFR || "Fruit Mystérieux"}](${fruit.wikiURL || "https://onepiece.fandom.com/fr/wiki/Fruit_du_D%C3%A9mon"}) - ${fruit.type || "Inconnu"} ${(eveille) ? "- Éveillé" : ""} \n_${fruit.nameJP || ""}_`
                if (OPEmbed.data.thumbnail && fruit.imgURL) {
                    OPEmbed.data.thumbnail.url = fruit.imgURL
                }
            }
        }
        await interaction.editReply({embeds: [OPEmbed]})


        await delay(TIMER)                                               //? PRIME
        let primeStr = "";
        if (OPEmbed.data.fields && OPEmbed.data.fields[9]) {
            OPEmbed.data.fields[9].name = `__Prime${primeName}__`

            if (side == "marine"){
                let marinePrime = ((prime/100)%5);
                for (let i = 0; i < marinePrime; i++) {
                    primeStr += "⭐"
                }
                OPEmbed.data.fields[9].value = `${primeStr}`;
            }
            else {
                primeStr = Number(prime).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                OPEmbed.data.fields[9].value = `${primeStr} Millions de ¥`;
            }
        }

        
        await interaction.editReply({embeds: [OPEmbed]});

        } catch (error) {
            console.error('Error in onepiece-char command:', error);
            const errorEmbed = new EmbedBuilder()
                .setTitle("❌ Erreur")
                .setDescription("Une erreur s'est produite lors de la génération du personnage One Piece.")
                .setColor(0xFF0000);
            
            if (interaction.replied || interaction.deferred) {
                await interaction.editReply({embeds: [errorEmbed]});
            } else {
                await interaction.reply({embeds: [errorEmbed], ephemeral: true});
            }
        }

    }
}