const { CommandInteraction, Client, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js")
const db = require("../../Models/my-pokedex")
const { errorEmbed, successEmbed } = require("../../util/Embeds")
const Pokedex = require("pokedex-promise-v2");
const P = new Pokedex();
const {pokemonNames} = require("../../util/pokemonNames")

module.exports = {

    name: "mypokedex",
    description: "My Pokedex",
    permission: "ADMINISTRATOR",
    active: true,
    options: [
        {
            name: "init",
            description: "initialize your pokedex",
            type: "SUB_COMMAND",
            
        },

        {
            name: "delete",
            description: "delete your pokedex",
            type: "SUB_COMMAND",
            
        },

        {
            name: "add",
            description: "add a pokemon to your pokedex",
            type: "SUB_COMMAND_GROUP",
            options: [
                {
                    name: "by-names",
                    description: "add one or several pokemons by name",
                    type: "SUB_COMMAND",
                    options: [
                        {
                            name: "pokemon",
                            description: "the pokemon name",
                            type: "STRING",
                            required: true,
                        }
                    ],
                },
                {
                    name: "by-index-numbers",
                    description: "add one or several pokemons by index number",
                    type: "SUB_COMMAND",
                    options: [
                        {
                            name: "index",
                            description: "the pokemon index",
                            type: "NUMBER",
                            required: true,
                        }
                    ],
                },
                {
                    name: "by-index-group",
                    description: "add group of pokemon by index number",
                    type: "SUB_COMMAND",
                    options: [
                        {
                            name: "min",
                            description: "the minimum index",
                            type: "NUMBER",
                            required: true,
                        },
                        {
                            name: "max",
                            description: "the maximum index",
                            type: "NUMBER",
                            required: true,
                        }
                    ],
                },
            ]
        },


        {
            name: "remove",
            description: "remove a pokemon from your pokedex",
            type: "SUB_COMMAND_GROUP",
            options: [
                {
                    name: "by-names",
                    description: "add one or several pokemons by name",
                    type: "SUB_COMMAND",
                    options: [
                        {
                            name: "pokemon",
                            description: "the pokemon name",
                            type: "STRING",
                            required: true,
                        }
                    ],
                },
                {
                    name: "by-index-numbers",
                    description: "add one or several pokemons by index number",
                    type: "SUB_COMMAND",
                    options: [
                        {
                            name: "index",
                            description: "the pokemon index",
                            type: "NUMBER",
                            required: true,
                        }
                    ],
                },
                {
                    name: "by-index-group",
                    description: "add group of pokemon by index number",
                    type: "SUB_COMMAND",
                    options: [
                        {
                            name: "min",
                            description: "the minimum index",
                            type: "NUMBER",
                            required: true,
                        },
                        {
                            name: "max",
                            description: "the maximum index",
                            type: "NUMBER",
                            required: true,
                        }
                    ],
                },
            ]
        },

        {
            name: "view",
            description: "view your pokedex",
            type: "SUB_COMMAND",

        },
        
    ],

    /**
     * 
     * @param {CommandInteraction} message 
     * @param {Client} client 
     */
  
    async execute(message, client) {
        
        const { options, guild, member } = message
        
        let Sub = options.getSubcommand(["view", "init","delete"])

        await message.deferReply()

        //! INITIALISATION DE LA BDD POKEDEX DU USER

        if (Sub === "init") {
            //if (message.member.permissions.has("ADMINISTRATOR")) { return message.editReply({ embed: [errorEmbed().setDescription("You need to be an administrator to use this command.")], ephemeral: true }) }
            
            let initEmbed = new MessageEmbed()
                .setTitle("Initialisation de votre Pokédex...")
                .setColor("#000000")
                .setDescription("Veuillez indiquer la version de votre jeu")
                .setTimestamp()


            let isInDB = false


            await db.findOne({ UserID: member.id }, async (err, doc) => {
                if (err) { return await message.editReply({ embed: [errorEmbed().setDescription("Une erreur a été rencontrée lors de la recherche de votre Pokédex")], ephemeral: true }) }
                if (doc) {
                    isInDB = true
                    return await message.editReply({ embeds: [errorEmbed().setDescription(`Tu as déjà un Pokédex`)], ephemeral: true })
                }
            }).clone()
            
            console.log(isInDB)
            if (isInDB) return;

            let tempDB = {}
            let versions = []
            let pokedexs = []

            await P.getVersionGroupsList().then(res => {

                res.results.forEach(version => {
                    let versionsBlacklist = ["colosseum", "xd"]

                    if (!versionsBlacklist.includes(version.name)) {
                        versions.push({ label: "Pokemon " + version.name, value: version.name })
                    }
                })
                
            })

            let row = new MessageActionRow().addComponents(
                new MessageSelectMenu()
                    .setOptions(versions)
                    .setCustomId("pokedex-version")
                    .setPlaceholder("Choisissez une version")
            )

            m = await message.editReply({
                embeds: [initEmbed],
                components: [row]
            })
            const versionCollector = m.createMessageComponentCollector({
                type: "SELECT_MENU",
                time: 60000
            })

            versionCollector.on("collect", async (menu) => {
                
                if (menu.user.id !== member.id) {
                    return menu.reply({
                        embeds: [errorEmbed().setDescription("Ce n'est pas ton Pokédex")],
                        ephemeral: true
                    })
                }
                                
                if (menu.customId === "pokedex-version") {

                    console.log();
                    tempDB.version = menu.values[0]

                    await P.getVersionGroupByName(menu.values[0]).then(res => {

                        let tempRegions = []
                        
                        if (res.regions.length > 1) {
                            res.regions.forEach(region => {
                                tempRegions.push(region.name)
                            })
                        } else {
                            tempRegions.push(res.regions[0].name)
                        }
                            
                        (tempRegions.length > 1) ? tempDB.regions = tempRegions.join(",") : tempDB.regions = tempRegions[0]

                        
                        let pokedexregions = ""

                        if (tempDB.regions.includes(",")) {
                            tempDB.regions.split(",").forEach(region => {
                                pokedexregions += "`" + region + "` "
                            })
                        } else {
                            pokedexregions = "`" + tempDB.regions + "`"
                        }

                        tempDB.generations = res.generation.name
                        initEmbed.addFields(
                            { name: "Version", value: `\`${menu.values[0]}\``, inline: true },
                            { name: "Région(s)", value: `${tempDB.regions}`, inline: true },
                            { name: "Génération", value: `\`${res.generation.name}\``, inline: true }
                        )
                        
                        let nationalBlacklist = ["lets-go", "firered-leafgreen", "red-blue", "yellow", "gold-silver", "crystal"]
                        
                        if (!nationalBlacklist.includes(menu.values[0])) {
                            pokedexs.push({ label: "National", value: "national" })
                        }

                        if (res.pokedexes.length > 1) {
                            
                            let pokedexlist = ""

                            res.pokedexes.forEach(pokedex => {
                                if (res.pokedexes.indexOf(pokedex) !== res.pokedexes.length - 1) {
                                    pokedexlist += pokedex.name + ","
                                } else {
                                    pokedexlist += pokedex.name
                                }
                            })

                            pokedexs.push({ label: "Tous les Pokédex de la région", value: `${pokedexlist}` })
                        }

                        res.pokedexes.forEach(pokedex => {
                            pokedexs.push({ label: pokedex.name, value: pokedex.name })
                        })
                        
                        
                        
                        
                    }).catch(err => {
                        console.log(err);
                        return message.editReply({ embeds: [errorEmbed().setDescription(`${err}`)], components: [], ephemeral: true })
                        
                    })
                    
                    
                    await menu.deferUpdate()
                    versionCollector.stop()
                    
                    let row = new MessageActionRow().addComponents(
                        new MessageSelectMenu()
                            .setOptions(pokedexs)
                            .setCustomId("pokedex-type")
                            .setPlaceholder("Choisissez un Pokédex")
                    )

                    await m.edit({
                        embeds: [initEmbed.setDescription("Veuillez choisir un Pokédex")],
                        components: [row]
                    })

                    const pokedexCollector = m.createMessageComponentCollector({
                        type: "SELECT_MENU",
                        time: 60000
                    })

                    pokedexCollector.on("collect", async (menu) => {

                        if (menu.user.id !== member.id) {
                            return menu.reply({
                                embeds: [errorEmbed().setDescription("Ce n'est pas ton Pokédex")],
                                ephemeral: true
                            })
                        }
                        
                        if (menu.customId === "pokedex-type") {

                            tempDB.pokedex = menu.values[0]
                            
                            let pokedexnames = ""

                            if (tempDB.pokedex.includes(",")) {
                                tempDB.pokedex.split(",").forEach(pokedex => {
                                    pokedexnames += "`" + pokedex + "` "
                                })
                            } else {
                                pokedexnames = "`" + tempDB.pokedex + "`"
                            }

                            initEmbed.addFields(
                                { name: "Pokédex", value: `${pokedexnames}`, inline: true }
                            )

                            await menu.deferUpdate()
                            pokedexCollector.stop()

                            let row = new MessageActionRow().addComponents(
                                new MessageSelectMenu()
                                    .setOptions([{ label: "Oui", value: "yes", emoji: "✔️" }, { label: "Non", value: "no", emoji: "❌" }])
                                    .setCustomId("pokedex-init-confirm")
                                    .setPlaceholder("Confirmer l'initialisation")
                            )

                            await m.edit({
                                embeds: [initEmbed.setDescription("\`\`\`Voulez-vous initialiser votre pokedex ?\`\`\`")],
                                components: [row]
                            })

                            const confirmCollector = m.createMessageComponentCollector({
                                type: "SELECT_MENU",
                                time: 60000
                            })

                            confirmCollector.on("collect", async (menu) => {

                                if (menu.user.id !== member.id) {
                                    return menu.reply({
                                        embeds: [errorEmbed().setDescription("Ce n'est pas ton Pokédex")],
                                        ephemeral: true
                                    })
                                }
                                if (menu.customId === "pokedex-init-confirm") {
                                    if (menu.values[0] === "yes") {
                                        
                                        tempDB.pokemonNotCatch = []

                                        await menu.deferUpdate()
                                        confirmCollector.stop()
                                        await m.edit({
                                            embeds: [initEmbed.setDescription("Initialisation en cours...")],
                                            components: []
                                        })
                                        

                                        if (tempDB.pokedex === "national") {
                                            console.log("national");

                                            let index_max
                                            
                                            //set max index with all generations

                                            if (tempDB.generations === "generation-i") {
                                                index_max = 151
                                            } else if (tempDB.generations === "generation-ii") {
                                                index_max = 251
                                            }
                                            else if (tempDB.generations === "generation-iii") {
                                                index_max = 386
                                            }
                                            else if (tempDB.generations === "generation-iv") {
                                                index_max = 493
                                            }
                                            else if (tempDB.generations === "generation-v") {
                                                index_max = 649
                                            }
                                            else if (tempDB.generations === "generation-vi") {
                                                index_max = 721
                                            }
                                            else if (tempDB.generations === "generation-vii") {
                                                index_max = 809
                                            }
                                            else if (tempDB.generations === "generation-viii") {
                                                index_max = 898
                                            }

                                            await P.getPokedexByName("national").then(res => {
                                                res.pokemon_entries.forEach(pokemon => {
                                                    if (pokemon.entry_number <= index_max) {
                                                        pokemonFR = Object.keys(pokemonNames).find(key => pokemonNames[key] === pokemon.pokemon_species.name)
                                                    
                                                        tempDB.pokemonNotCatch.push(
                                                            {
                                                                name: pokemonFR,
                                                                index: pokemon.entry_number,
                                                                pokedex: "national"
                                                            }
                                                        );
                                                    }
                                                })
                                            })
                                             
                                            

                                        }
                                        else if (tempDB.pokedex.includes(",")) {
                                            console.log("multiple");
                                            let pokedexes = tempDB.pokedex.split(",")
                                            console.log(pokedexes);

                                            for (let i = 0; i < pokedexes.length; i++) {
                                                let pokemonFR
                                                await P.getPokedexByName(pokedexes[i]).then(res => {

                                                    res.pokemon_entries.forEach(pokemon => {

                                                        pokemonFR = Object.keys(pokemonNames).find(key => pokemonNames[key] === pokemon.pokemon_species.name)
                                                    
                                                        tempDB.pokemonNotCatch.push(
                                                            {
                                                                name: pokemonFR,
                                                                index: pokemon.entry_number,
                                                                pokedex: pokedexes[i]
                                                            }
                                                        );
                                                    
                                                    })
                                                
                                                })
                                            }

                                        }
                                        else {
                                            console.log("single");
                                            await P.getPokedexByName(tempDB.pokedex).then(res => {
                                                res.pokemon_entries.forEach(pokemon => {
                                                    pokemonFR = Object.keys(pokemonNames).find(key => pokemonNames[key] === pokemon.pokemon_species.name)
                                                    
                                                    tempDB.pokemonNotCatch.push(
                                                        {
                                                            name: pokemonFR,
                                                            index: pokemon.entry_number,
                                                            pokedex: tempDB.pokedex
                                                        }
                                                    );
                                                })
                                            })
                                            
                                        }

                                        console.log(tempDB.pokemonNotCatch);

                                        
                                        //create line in DB
                                        
                                        await db.findOne({ UserID: member.id }, (err, data) => {
                                            if (err) throw err;
                                            if (!data) {
                                                data = new db({
                                                    
                                                    UserID: member.id,
                                                    UserTag: member.user.tag,
                                                    
                                                    PokedexName: tempDB.pokedex,            // ex: national
                                                    PokedexRegion: tempDB.regions,          // ex: galar
                                                    PokedexGameVersion: tempDB.version,     // ex: sword-shield
                                                    PokedexGeneration: tempDB.generations,      // ex: gen-7
                                                    
                                                    PokemonNotYetCaught: tempDB.pokemonNotCatch,
                                                })
                                                data.save()
                                            }
                                        }).clone()

                                    
                                        await m.edit({
                                            embeds: [initEmbed.setTitle("✅ Pokedex initialisé ✅").setDescription("Votre Pokédex a été initialisé avec succès. ").setColor("#00ff00")],
                                            components: []
                                        })


                                    } else {
                                        await menu.deferUpdate()
                                        confirmCollector.stop()
                                        await m.edit({
                                            embeds: [new MessageEmbed().setDescription("Votre Pokédex n'a pas été initialisé.").setColor("RED")],
                                            components: []
                                        })
                                    }
                                }
                            })

                            confirmCollector.on("end", async (collected, reason) => {
                                if (reason === "time") {
                                    return m.edit({ embeds: [errorEmbed().setDescription("Vous n'avez pas comfirmé dans le temps imparti")], components: [], ephemeral: true })
                                }
                            })
                        }


                    })

                    pokedexCollector.on("end", async (collected, reason) => {
                        if (reason === "time") {
                            return m.edit({ embeds: [errorEmbed().setDescription("Vous n'avez pas choisis de Pokédex dans le temps imparti")], components: [], ephemeral: true })
                        }
                    })


                }
            })
            versionCollector.on("end", async (collected, reason) => {
                if (reason === "time") {
                    return m.edit({ embeds: [errorEmbed().setDescription("Vous n'avez pas choisis de version dans le temps imparti")], components: [], ephemeral: true })
                }
            })

            
        }

        //! SUPPRESION DE LA BDD POKEDEX DU USER

        else if (Sub === "delete") {
            
            let deleteEmbed = new MessageEmbed()
                .setTitle("Supression de votre Pokédex...")
                .setColor("RED")
                .setDescription("\`\`\`Êtes-vous sûr de vouloir supprimés votre Pokédex ?\`\`\`")
                .setTimestamp()

            await db.findOne({ UserID: member.id }, async (err, data) => {
                if (err) { return await message.editReply({ embed: [errorEmbed().setDescription("Une erreur a été rencontrée lors de la recherche de votre Pokédex")], ephemeral: true }) }
                if (!data) {
                    return await message.editReply({ embeds: [errorEmbed().setDescription(`Vous n'avez pas de Pokédex.\nPour créer un Pokédex, utilisez la commande : \`/${this.name} init\`.`)], ephemeral: true })
                } else {

                    let pokedexnames = ""
                    let pokedexregions = ""

                    if (data.PokedexName.includes(",")) {
                        data.PokedexName.split(",").forEach(pokedex => {
                            pokedexnames += "`" + pokedex + "` "
                        })
                    } else {
                        pokedexnames = "`" + data.PokedexName + "`"
                    }
                    
                    if (data.PokedexRegion.includes(",")) {
                        data.PokedexRegion.split(",").forEach(region => {
                            pokedexregions += "`" + region + "` "
                        })
                    } else {
                        pokedexregions = "`" + data.PokedexRegion + "`"
                    }

                    deleteEmbed.addFields(
                        { name: "Pokedex", value: `${pokedexnames}`, inline: true },
                        { name: "Région(s)", value: `${pokedexregions}`, inline: true },
                        { name: "Version", value: `\`${data.PokedexGameVersion}\``, inline: true },
                        { name: "Génération", value: `\`${data.PokedexGeneration}\``, inline: true },
                        { name: "Pokémon attrapé/vu", value: `\`${data.PokemonCaught.length}\``, inline: true },
                        { name: "Pokémon non attrapé/vu", value: `\`${data.PokemonNotYetCaught.length}\``, inline: true },
                    )






                    let row = new MessageActionRow().addComponents(
                        new MessageSelectMenu()
                            .setOptions([{ label: "Oui", value: "yes", emoji: "✔️" }, { label: "Non", value: "no", emoji: "❌" }])
                            .setCustomId("pokedex-delete-confirm")
                            .setPlaceholder("Confirmer la suppression")
                    )

                    let m = await message.editReply({
                        embeds: [deleteEmbed],
                        components: [row],
                        ephemeral: true
                    })

                    const confirmCollector = m.createMessageComponentCollector({
                        type: "SELECT_MENU",
                        time: 60000
                    })

                    confirmCollector.on("collect", async (menu) => {

                        if (menu.user.id !== member.id) {
                            return menu.reply({
                                embeds: [errorEmbed().setDescription("Ce n'est pas ton pokédex")],
                                ephemeral: true
                            })
                        }
                        if (menu.customId === "pokedex-delete-confirm") {
                            
                            
                            if (menu.values[0] === "yes") {
                                
                                confirmCollector.stop()
                                await menu.deferUpdate()
                                await data.delete()


                                await message.edit({
                                    embeds: [deleteEmbed.setTitle("🗑️ Pokédex supprimé 🗑️").setDescription("Votre Pokédex a été supprimé avec succès.")],
                                    components: [],
                                    ephemeral: true
                                })


                            } else {
                                await menu.deferUpdate()
                                confirmCollector.stop()
                                await message.edit({
                                    embeds: [new MessageEmbed().setDescription("Votre Pokédex n'a pas été supprimé.").setColor("RED")],
                                    components: [],
                                    ephemeral: true
                                })
                            }
                        }
                    })

                    confirmCollector.on("end", async (collected, reason) => {
                        if (reason === "time") {
                            return m.edit({
                                embeds: [errorEmbed().setDescription("Vous n'avez pas confirmé dans le temps imparti")],
                                components: [],
                                ephemeral: true
                            })
                        }
                    })
                }
            }).clone()


        }
        
        //! AFFICHAGE DES INFORMATIONS DU POKÉDEX    
            
        else if (Sub === "view") { 
            
            let viewEmbed = new MessageEmbed()
                .setColor("GOLD")
                

            await db.findOne({ UserID: member.id }, async (err, data) => {
                if (err) { return await message.editReply({ embed: [errorEmbed().setDescription("Une erreur a été rencontrée lors de la recherche de votre Pokédex")], ephemeral: true }) }
                if (!data) {
                    return await message.editReply({ embeds: [errorEmbed().setDescription(`Vous n'avez pas de Pokédex.\nPour créer un Pokédex, utilisez la commande : \`/${this.name} init\`.`)], ephemeral: true })
                } else {
                    let pokedexnames = ""
                    let pokedexregions = ""

                    if (data.PokedexName.includes(",")) {
                        data.PokedexName.split(",").forEach(pokedex => {
                            pokedexnames += "`" + pokedex + "` "
                        })
                    } else {
                        pokedexnames = "`" + data.PokedexName + "`"
                    }
                    
                    if (data.PokedexRegion.includes(",")) {
                        data.PokedexRegion.split(",").forEach(region => {
                            pokedexregions += "`" + region + "` "
                        })
                    } else {
                        pokedexregions = "`" + data.PokedexRegion + "`"
                    }
                    
                    
                    viewEmbed.setAuthor(`Pokédex de ${member.user.username}`, member.displayAvatarURL())
                        .setDescription(`**Complété à ${Math.round((data.PokemonCaught.length/data.PokemonNotYetCaught.length)*100)} %**\n`)
                        .addFields(
                            { name: "Pokedex", value: `${pokedexnames}`, inline: true },
                            { name: "Région(s)", value: `${pokedexregions}`, inline: true },
                            { name: "Version", value: `\`${data.PokedexGameVersion}\``, inline: true },
                            { name: "Génération", value: `\`${data.PokedexGeneration}\``, inline: true },
                            { name: "Pokémon attrapé/vu", value: `\`${data.PokemonCaught.length}\``, inline: true },
                            { name: "Pokémon non attrapé/vu", value: `\`${data.PokemonNotYetCaught.length}\``, inline: true },
                    )
                    
                    message.editReply({embeds: [viewEmbed]})
                }
            }).clone()






        }

    }
}