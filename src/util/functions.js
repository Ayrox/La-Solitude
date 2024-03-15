import { EmbedBuilder, CommandInteraction, GuildMember, ActionRowBuilder, ButtonBuilder } from "discord.js";
import Pokedex from "pokedex-promise-v2";
import { errorEmbed } from "./Embeds.js";
const P = new Pokedex();

/**
*
* @param {String} str
* @returns {String}
*/
function toCapitalize (str) {
    let strTable = str.replaceAll("_", " ").replaceAll(".", " ").split(" ");
    for (var i = 0; i < strTable.length; i++) {
        strTable[i] = strTable[i].charAt(0).toUpperCase() + strTable[i].slice(1);
    }
    return strTable.join(" ");
}

/**
 * 
 * @param {Number, String} pokemon 
 * @returns 
 */
async function fetchPokemonData(pokemon) {
    
    let data = {}

    await P.getPokemonSpeciesByName(pokemon).then(async (pok) => {
        
        let index = (num, size) => {
            num = num.toString();
            while (num.length < size) num = "0" + num;
            return num;
        }
        
        let color = toCapitalize(pok.color.name)
        switch (color) {
            case "Gray":
                color = "Grey"    
                break;
            case "Pink":
                color = "Random"
                break
        
            default:
                break;
        }

        let evolution_chain = []
        
         await P.getEvolutionChainById(pok.evolution_chain.url.substring(42, pok.evolution_chain.url.length-1)).then(async (evolv) => {
            
            if (evolv.chain.evolves_to.length === 0) return;
            
            let first = await P.getPokemonSpeciesByName(evolv.chain.species.name).then((pok) => { return pok.names.find(x => x.language.name === "fr").name })
            
            
            for(element of evolv.chain.evolves_to) {
                
                let arrayIN = [first]

                let second = await P.getPokemonSpeciesByName(element.species.name).then((pok) => { return pok.names.find(x => x.language.name === "fr").name })
                arrayIN.push(second)


                if(element.evolves_to.length > 0){
                    let third = await P.getPokemonSpeciesByName(element.evolves_to[0].species.name).then((pok) => { return pok.names.find(x => x.language.name === "fr").name })
                    arrayIN.push(third)
                }
                
                evolution_chain.push(arrayIN)
                
            };
             
            
         })
        
        
        
        Object.assign(data, {
            color: color,
            nom: pok.names.find(x => x.language.name === "fr").name,
            indexPokedex: index(pok.pokedex_numbers.find(x => x.pokedex.name === "national").entry_number,3),
            description: (pok.flavor_text_entries.find(x => x.language.name === "fr") === undefined) ? null : pok.flavor_text_entries.find(x => x.language.name === "fr").flavor_text,
            region: (pok.generation === null) ? null : await P.getGenerationByName(pok.generation.name).then((gen) => { return gen.main_region.name }),
            categorie: (pok.genera.find(x => x.language.name === "fr"))?pok.genera.find(x => x.language.name === "fr").genus : "Undefined",
            isLegendary:pok.is_legendary ,
            isMythical: pok.is_mythical,
            habitat: (pok.habitat === null) ? null : await P.getPokemonHabitatByName(pok.habitat.name).then((hab) => { return hab.names.find(x => x.language.name === "fr").name}),
            shape: (pok.shape === null) ? null : await P.getPokemonShapeByName(pok.shape.name).then((shape) => { return shape.names.find(x => x.language.name === "fr").name}),
            evolution: evolution_chain,
            tauxCapture: pok.capture_rate,
        })

        await P.getPokemonByName(pok.varieties[0].pokemon.url.substring(34, pok.varieties[0].pokemon.url.length-1)).then(async (pok) => {
            
            let type = []
            let typeFR

            for (element of pok.types) {
                
                typeFR = await P.getTypeByName(element.type.name).then((type) => { return type.names.find(x => x.language.name === "fr").name })
                type.push(typeFR)
            }

            let imgURL = () => {
                let isAnimated = pok.sprites.versions["generation-v"]["black-white"].animated.front_default;

                if (isAnimated != null) {                                 //if animated
                    return isAnimated
                }
                else { //not animated
                    return pok.sprites.front_default
                }
            }


            Object.assign(data, {
                taille: pok.height/10,
                poids: pok.weight/10,
                types: type,
                image: imgURL(),
            })

            
            await P.getPokemonFormByName(pok.forms[0].url.substring(39, pok.forms[0].url.length-1)).then(async (form) => {
                
                Object.assign(data, {
                    isMega: form.is_mega,
                    version : form.version_group.name, 
                })
    
    
            })
        })
    })



    return data

}

/**
 * 
 * @param {Number} currentTime 
 * @param {Number} duration 
 * @param {Boolean} isPaused 
 * @returns 
 */
function generateProgressBar (currentTime, duration, isPaused = false) {
    
//make a ASCII progress bar |------🔴--------|
    let progressBar = "|"
    let progressBarLength = 25
    let progressBarMax = duration
    let progressBarCurrent = currentTime
    let progressBarPercent = (progressBarCurrent / progressBarMax) * 100
    let progressBarPercentRounded = Math.round(progressBarPercent/(100/progressBarLength))
    for (let i = 0; i < progressBarLength; i++) {
        if (i < progressBarPercentRounded) {
            progressBar = progressBar.concat("─")
        } else  if (i == progressBarPercentRounded) {
            progressBar = progressBar.concat(isPaused ? "⏸️" : "🔹")
        } else {
            progressBar = progressBar.concat("─")
        }
    }
    progressBar = progressBar.concat("|")
    return progressBar

}

/**
 * 
 * @param {Array} array 
 * @param {String} key 
 * @returns 
 */

function SortObjectArray (array, key) {
    
    array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
    return array;
}


export default {

    toCapitalize,
    generateProgressBar,
    fetchPokemonData,
    SortObjectArray,

    



}