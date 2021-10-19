const { MessageEmbed } = require("discord.js");

module.exports = {
    
//------------------------ ERROR -------------------------------    
    errorEmbed: () => {
        
        return new MessageEmbed()
            .setColor("#FF0000")
            .setTitle("⛔ **Erreur**: ⛔")
        
    },

//---------------------- POKEMON -------------------------------
    pokemonEmbed: () => {
        return new MessageEmbed()
            .setAuthor("POKEDEX NATIONAL", "https://www.g33kmania.com/wp-content/uploads/Pokemon-Pokedex.png")
            .setFooter("Pokédex National | Made by Syns", "https://www.g33kmania.com/wp-content/uploads/Pokemon-Pokedex.png")
            .setTimestamp()
        
    },

    pokemonEasterEggEmbed: () => {
        return new MessageEmbed()
            .setColor("#FF0000")
            .setAuthor("POKEDEX NATIONAL", "https://www.g33kmania.com/wp-content/uploads/Pokemon-Pokedex.png")
            .setFooter("Pokédex National | Made by Syns", "https://www.g33kmania.com/wp-content/uploads/Pokemon-Pokedex.png")
            .setTimestamp()

    },


//------------------------------------------------------------------    
    
}