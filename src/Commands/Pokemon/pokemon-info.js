 
import Discord, { ChatInputCommandInteraction, Client } from "discord.js";
// import https from "https";
// import axios from "axios";
import pokemon from "../../util/pokemonNames.json" assert {type: "json"};
const { pokemonNames } = pokemon;
import * as Embed from "../../util/Embeds.js";
import fs from "fs";
import { fetchPokemonData } from "../../util/functions.js";
import Pokedex from "pokedex-promise-v2";
import { type } from "os";
const P = new Pokedex();

export const command = {
    data: new Discord.SlashCommandBuilder()
        .setName("pokemon-info")
        .setDescription("Affiche les informations d'un Pokémon")
        .addStringOption((option) =>
            option
                .setName("pokemon")
                .setDescription(`Nom ou numéro du Pokémon`)
                .setRequired(true)
        ),
    /**
     * 
     * @param {ChatInputCommandInteraction} message 
     * @returns 
     */
    async execute(message,client) {

        await message.deferReply();
        //if(!message.guild.emojis.cache.find('pokeball')) message.guild.emojis.create({name:'pokeball', attachment: 'https://cdn.discordapp.com/emojis/898941316451422248.webp'}) ;
        let pokemonArgs = message.options.getString("pokemon");

        let pokemonEN =
            pokemonNames[
                pokemonArgs
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/\p{Diacritic}/gu, "")
            ];

        if (isNaN(pokemonArgs)) {
            if (pokemonEN) {
                //check if the name exist
            } else if (pokemonArgs.toLowerCase() === "trepuec") {
                //trepuec

                return message.editReply({
                    embeds: [
                        Embed.pokemonEasterEggEmbed()
                            .setTitle(
                                "<:pokeball:898941316451422248> \\_\\_\\_\\_\\_ François Le Trepuec \\_\\_\\_\\_\\_ <:pokeball:898941316451422248>"
                            )
                            .setDescription(
                                "La centrale à la fin, je vous le dis tout de suite, Mr Leclerc il vas arriver ça vas faire wow wow wow wow"
                            )
                            .setThumbnail(
                                "https://cdn.discordapp.com/attachments/492828685217431553/888620797449617438/oie_185124SSdPVhk7.gif"
                            ),
                    ],
                });
            } else if (pokemonArgs.toLowerCase() === "ewen") {
                //ewen
                return message.editReply({
                    embeds: [
                        Embed.pokemonEasterEggEmbed()
                            .setTitle(
                                "<:pokeball:898941316451422248> \\_\\_\\_\\_\\_ Ewen Guégan \\_\\_\\_\\_\\_ <:pokeball:898941316451422248>"
                            )
                            .setThumbnail(
                                "https://cdn.discordapp.com/attachments/492828685217431553/888622310880325682/unknown.png"
                            ),
                    ],
                });
            } else {
                //does not exist
                return message.editReply({
                    embeds: [
                        Embed.errorEmbed().setDescription("Ce Pokémon n'existe pas."),
                    ],
                });
            }
        } else {
            if (!1 <= pokemonArgs <= 898) {
                //in range
                pokemonEN = pokemonArgs;
            } else {
                //not in range
                return message.reply({
                    embeds: [
                        Embed.errorEmbed().setDescription(
                            "Il n'existe que 898 Pokémon à ce jour, choisissez un Pokémon existant !"
                        ),
                    ],
                });
            }
        }

        message.editReply({
            embeds: [
                Embed.pokemonEmbed()
                    .setDescription("⏳ Loading data ...")
                    .setColor("#ff6800"),
            ],
        });

        let pokemonData
        try{ 
            pokemonData = await fetchPokemonData(pokemonEN); 
        } catch(e) {
            return message.editReply({
                embeds: [
                    Embed.errorEmbed().setDescription(`Une erreur est survenue : ${e}`),
                ],
                ephemeral: true,
            });
            
        }

        let evolv = () => {
            if (!(pokemonData.evolution.length > 0))
                return "```Aucune chaine d'évolution```";

            let str = "";

            for (const chain of pokemonData.evolution) {
                for (evolv in chain) {
                    if (chain[evolv] === pokemonData.nom) {
                        str += " __**`" + `${chain[evolv]}` + "`**__ ";
                    } else {
                        str += " `" + `${chain[evolv]}` + "` ";
                    }

                    if (chain[evolv] !== chain[chain.length - 1]) str += "-->";
                }
                str += "\n";
            }

            return str;
        };

        try {
            message.editReply({
                embeds: [
                    Embed.pokemonEmbed()
                        .setTitle(
                            `<:pokeball:898941316451422248> \\_\\_\\_\\_\\___| #${pokemonData.indexPokedex} ${pokemonData.nom} |__\\_\\_\\_\\_\\_ <:pokeball:898941316451422248>`
                        )
                        .setDescription(
                            `**_${pokemonData.categorie}_**\n_\`\`\`${pokemonData.description}\`\`\`_\n`
                        )
                        .setColor((isNaN(pokemonData.color))? "Aqua" : pokemonData.color)
                        .setThumbnail(pokemonData.image)

                        .addFields(
                            {
                                name: "__**Type(s) :**__",
                                value: "```" + `${pokemonData.types}`.replace(",", " | ") + "```"
                            },
                            {
                                name: "__**Région :**__",
                                value: "```" +
                                    pokemonData.region.charAt(0).toUpperCase() +
                                    pokemonData.region.slice(1) +
                                    "```",
                                inline: true
                            },
                            {
                                name: "__**Habitat :**__",
                                value: pokemonData.habitat === null
                                    ? "```Non défini```"
                                    : "```" +
                                        pokemonData.habitat
                                            .charAt(0)
                                            .toUpperCase() +
                                        pokemonData.habitat.slice(1) +
                                        "```",
                                inline: true
                            },
                            {
                                name: "__**Taille :**__",
                                value: "```" + pokemonData.taille + " m```",
                                inline: true
                            },
                            {
                                name: "__**Version d'apparition :**__",
                                value: "```" + pokemonData.version + "```",
                                inline: true
                            },
                            {
                                name: "__**Forme :**__",
                                value: "```" + pokemonData.shape + "```",
                                inline: true
                            },
                            {
                                name: "__**Poids :**__",
                                value: "```" + pokemonData.poids + " kg```",
                                inline: true
                            },
                            {
                                name: "__**Légendaire :**__",
                                value: pokemonData.isLegendary ? "```Oui```" : "```Non```",
                                inline: true
                            },
                            {
                                name: "__**Mythique :**__",
                                value: pokemonData.isMythical ? "```Oui```" : "```Non```",
                                inline: true
                            },
                            {
                                name: "__**Méga-évolution :**__",
                                value: pokemonData.isMega ? "```Oui```" : "```Non```",
                                inline: true
                            },
                            {
                                name: "__**Taux de Capture :**__",
                                value: "```" +
                                    Math.round(
                                        (pokemonData.tauxCapture * 100) / 255,
                                        2
                                    ) +
                                    " % ```",
                                inline: true
                            },
                            {
                                name: "__**Evolution :**__",value: evolv(),inline: true
                            }
                        ),
                ],
            });
        } catch (e) {
            console.log(e)
            message.editReply({
                embeds: [Embed.errorEmbed().setDescription(`\`${e}\``)],
            });
        }
    },
};
