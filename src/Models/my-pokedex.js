const { Schema, model } = require('mongoose');

module.exports = model('MyPokedex', new Schema({

    UserID: String,
    UserTag: String,

    PokedexName: String,            // ex: national
    PokedexRegion: String,          // ex: galar
    PokedexGameVersion: String,     // ex: sword-shield
    PokedexGeneration: String,      // ex: gen-7
    
    PokemonCaught: Array,
    PokemonNotYetCaught: Array,


}));