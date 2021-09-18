const { Command } = require("discord-akairo");
const Discord = require("discord.js");
// const https = require("https");
// const axios = require("axios");
var Pokedex = require("pokedex-promise-v2");
var P = new Pokedex();

class PokemonlistCommand extends Command {
  constructor() {
    super("pokemonlist", {
      aliases: ["pokemonlist"],
      args: [
        { id: "limit", type: null },
        // { id: "limit", type: "int" },
      ],
    });
  }

  async exec(message, args) {
    var interval = {
      limit: args.limit,
      offset: 34,
    };

    if (!isNaN(parseInt(args.limit))) {
      if (args.limit >= 1 && args.limit <= 10) {
        P.getPokemonsList(interval).then(function (response) {
          let name = response.results;
          name.forEach((element) => {
            // console.log(element.name);
            P.getPokemonByName(element.name) // with Promise
              .then(function (response) {
                // console.log(response.name);
                message.channel.send(response.name);
                message.channel.send(response.sprites.front_default);
              });
          });
        });
      } else {
        message.channel.send("Choisis un nombre entre 1 et 10 !");
      }
    } else {
      message.channel.send("not a number !");
    }

    // let pokemonArg = args.pokemon;
    // let response = await axios.get(
    //   "https://pokeapi.co/api/v2/pokemon/" + pokemonArg
    // );
    // // console.log(response.data);
    // let pokemon = response.data;
    // pokemon.results.forEach((element) => {
    //   //   console.log(element.name);
    //   message.channel.send(element.name);
    //   //   message.channel.send(element.sprites);
    // });
    // // console.log(pokemon);
    // // message.channel.send(pokemon.name);
    // // message.channel.send(pokemon.sprites.front_default);
  }
}

module.exports = PokemonlistCommand;