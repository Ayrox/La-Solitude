 
import Discord from "discord.js";
// import https from "https");
// import axios from "axios");
import Pokedex from "pokedex-promise-v2";
var P = new Pokedex();
import * as Embed from "../../util/Embeds.js";

export const command = {
    data: new Discord.SlashCommandBuilder()
        .setName("pokemon-list")
        .setDescription("Affiche 1 à 10 Pokémon random")
        .addStringOption((option) =>
            option
                .setName("limit")
                .setDescription(
                    `Choisis une limite de pokemon entre 1 et 10 à afficher`
                )
                .setRequired(true)
        ),

    async execute(message) {
        let limit = message.options.getString("limit");

        var interval = {
            limit: message.options.getString("limit"),
            offset: Math.random() * 100 * limit, //randomise l'offset
        };

        //fonction qui envoie les pokemons
        const sendPokemon = (interval) => {
            P.getPokemonsList(interval)
                .then(function (response) {
                    message.reply(`La liste de ${interval.limit} Pokémon`);

                    response.results.forEach((pokemon) => {
                        P.getPokemonByName(pokemon.name)
                            .then(function (response) {
                                let isAnimated =
                                    response.sprites.versions["generation-v"][
                                        "black-white"
                                    ].animated.front_default;

                                if (isAnimated != null) {
                                    //if animated

                                    message.channel.send(response.name);
                                    message.channel.send(isAnimated);
                                } else {
                                    //not animated

                                    message.channel.send(response.name);
                                    message.channel.send(
                                        response.sprites.front_default
                                    );
                                }
                            })
                            .catch(function (error) {
                                //catch error
                                console.log("ERROR: ", error);
                                message.reply({
                                    embeds: [
                                        Embed.errorEmbed().setDescription(error),
                                    ],
                                });
                            });
                    });
                })
                .catch(function (error) {
                    //catch error
                    console.log("ERROR: ", error);
                    message.reply({
                        embeds: [Embed.errorEmbed().setDescription(error)],
                    });
                });
        };

        if (interval.limit >= 1 && interval.limit <= 10) {
            //check si la limite se trouve entre 1 et 10

            sendPokemon(interval); //envoie les pokemons
        } else if (isNaN(interval.limit)) {
            //check si la limit n'est pas un nombre

            message.reply({
                embeds: [Embed.errorEmbed().setDescription("Choisissez un nombre !")],
            });
        } else {
            message.reply({
                embeds: [
                    Embed.errorEmbed().setDescription(
                        "Choisissez un nombre entre 1 et 10 !"
                    ),
                ],
            });
        }
    },
};
