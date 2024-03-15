import delay from "delay";
import { EmbedBuilder, SlashCommandBuilder, CommandInteraction } from "discord.js";
import { OnePieceEmbed } from "../../util/Embeds.js";
import { toCapitalize } from "../../util/functions.js";

import OP from '../../util/OnePieceData.json' assert { type: "json" }

export default {
    data: new SlashCommandBuilder()
        .setName("onepiece-char")
        .setDescription("Créer un personnage de One Piece avec des caractéristiques aléatoires"),

    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        
        const TIMER = 1000;

        await interaction.reply({embeds:[OnePieceEmbed(interaction.member.user.username)]});

        const side = OP.side[Math.floor(Math.random() * OP.side.length)];
        const grade = OP.level[side][Math.floor(Math.random() * OP.level[side].length)];
        const race = OP.races[Math.floor(Math.random() * OP.races.length)]; 
        const Intelligence = OP.smartLevel[Math.floor(Math.random() * OP.smartLevel.length)];
        const Force = OP.strenghLevel[Math.floor(Math.random() * OP.strenghLevel.length)];
        const Vitesse = OP.speedLevel[Math.floor(Math.random() * OP.speedLevel.length)]; 
        const Region = OP.originRegion[Math.floor(Math.random() * OP.originRegion.length)]
        let OPEmbed = OnePieceEmbed(interaction.member.user.username)
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
                        nameFR: OP.smileNames[Math.floor(Math.random() * OP.smileNames.length)],
                        nameJP: "",
                        type: "SMILE",
                        imgURL: OP.smileImgURL,
                        wikiURL: OP.smileWikiURL
                        
                    }
                    prime += 50
                } else { // Smile défectueux
                    fruit= {
                        nameFR: "SMILE Défectueux",
                        nameJP: "",
                        type: "SMILE",
                        imgURL: OP.noSmileURL,
                        wikiURL: OP.smileWikiURL
                    }
                    prime = prime / 2
                }
            } else { // a un fruit 
                
                fruit = OP["demon-fruit"][Math.floor(Math.random() * OP["demon-fruit"].length)]
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
            haki.push(`${OP.masteryLevel[rnd]} - Haki de l'Armement`)
            prime += 10 * (rnd + 1)
        }
        if(Math.random()*4>3){ // Haki Observation?
            let rnd = Math.floor(Math.random()*5)
            haki.push(`${OP.masteryLevel[rnd]} - Haki de l'Observation`)
            prime += 25 * (rnd + 1)
        }
        if(Math.random()*4>3){ // Haki Roi ?
            let rnd = Math.floor(Math.random()*5)
            haki.push(`${OP.masteryLevel[rnd]} - Haki des Rois`)
            prime += 50 * (rnd + 1)
        }
        
        await delay(TIMER)                                               //? GRADE
        OPEmbed.data.fields[0].value = `${grade.name}`
        OPEmbed.data.fields[1].value = `${toCapitalize(side)}`      //? SIDE
        OPEmbed.data.color = color
        await interaction.editReply({embeds: [OPEmbed]})
    
        await delay(TIMER)                                               //? RACE
        OPEmbed.data.fields[2].value = `[${race.name}](${race.url})`
        await interaction.editReply({embeds: [OPEmbed]})

        await delay(TIMER)                                               //? REGION
        OPEmbed.data.fields[3].value = Region
        await interaction.editReply({embeds: [OPEmbed]})

        await delay(TIMER)                                               //? FORCE
        OPEmbed.data.fields[4].value = Force.name
        await interaction.editReply({embeds: [OPEmbed]})
        
        await delay(TIMER)                                               //? INTELLIGENCE
        OPEmbed.data.fields[5].value = Intelligence.name
        await interaction.editReply({embeds: [OPEmbed]})
        
        await delay(TIMER)                                               //? VITESSE
        OPEmbed.data.fields[6].value = Vitesse.name
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
        OPEmbed.data.fields[7].value = s
        await interaction.editReply({embeds: [OPEmbed]})

        await delay(TIMER)                                               //? FRUIT
        if (!fruit){
            OPEmbed.data.fields[8].value = `❌`
        } else {
            OPEmbed.data.fields[8].value = `[${fruit.nameFR}](${fruit.wikiURL}) - ${fruit.type} ${(eveille) ? "- Éveillé" : ""} \n_${fruit.nameJP}_`
            OPEmbed.data.thumbnail.url = fruit.imgURL
        }
        await interaction.editReply({embeds: [OPEmbed]})


        await delay(TIMER)                                               //? PRIME
        let primeStr = "";
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

        
        await interaction.editReply({embeds: [OPEmbed]});

    }
}