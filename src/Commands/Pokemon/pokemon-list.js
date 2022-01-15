const Discord = require("discord.js");
// const https = require("https");
// const axios = require("axios");
var Pokedex = require("pokedex-promise-v2");
var P = new Pokedex();
const { errorEmbed } = require("../../util/Embeds")

module.exports = {
  
  name: "pokemon-list",
  description: "Affiche 1 à 10 pokemon random",
  permission: "ADMINISTRATOR",
  active: true,

  options: [
    {
      name: "limit",
      description: "Choisis une limite de pokemon entre 1 et 10 à afficher",
      type: "STRING",
      required : true,
    },
  ],

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

              let isAnimated = response.sprites.versions["generation-v"]["black-white"].animated.front_default;

              if (isAnimated != null) { //if animated

                message.channel.send(response.name);
                message.channel.send(isAnimated);

              } else { //not animated

                message.channel.send(response.name);
                message.channel.send(response.sprites.front_default);
                
              }
              
            })
            .catch(function (error) { //catch error
              console.log("There was an ERROR: ", error);
              message.reply({ embeds: [errorEmbed().setDescription(error)] });
            });
        });
      })
      .catch(function (error) { //catch error
        console.log("There was an ERROR: ", error);
        message.reply({ embeds: [errorEmbed().setDescription(error)] });
      });
    };


    if (interval.limit >= 1 && interval.limit <= 10) { //check si la limite se trouve entre 1 et 10

      sendPokemon(interval); //envoie les pokemons

    } else if (isNaN(interval.limit)) { //check si la limit n'est pas un nombre

      message.reply({ embeds: [errorEmbed().setDescription("Choisis un nombre !")] });
      
    } else {
      
      message.reply({ embeds: [errorEmbed().setDescription("Choisis un nombre entre 1 et 10 !")] });

    }
  }
}
