const { MessageEmbed,} = require("discord.js");

module.exports = {
    
//!------------------------ ERROR -------------------------------    
    errorEmbed: () => {
        
        return new MessageEmbed()
            .setColor("#FF0000")
            .setTitle("⛔ **Erreur**: ⛔")
            .setTimestamp()
        
    },

//!------------------------ SUCCESS -------------------------------
    successEmbed: () => {
            
            return new MessageEmbed()
                .setColor("#00FF00")
                .setTitle("✅ **Success**: ✅")
                .setTimestamp()

    },

//!------------------------ Music -------------------------------    
    musicEmbed: () => {
        return new MessageEmbed()
            .setColor("#7F00FF")
            .setAuthor({
                name:"Spotifion",
                iconURL: "https://www.iconsdb.com/icons/preview/violet/spotify-xxl.png"
            })
            .setTimestamp()
    },
//!---------------------- POKEMON -------------------------------
    pokemonEmbed: () => {
        return new MessageEmbed()
            .setAuthor({
                name: "POKÉDEX NATIONAL",
                iconURL: "https://www.g33kmania.com/wp-content/uploads/Pokemon-Pokedex.png"
            })
            .setFooter({
                name: "Pokédex National | Made by Syns",
                iconURL: "https://www.g33kmania.com/wp-content/uploads/Pokemon-Pokedex.png"
            })
            .setTimestamp()
        
    },

    pokemonEasterEggEmbed: () => {
        return new MessageEmbed()
            .setColor("#FF0000")
            .setAuthor({
                name: "POKÉDEX NATIONAL",
                iconURL: "https://www.g33kmania.com/wp-content/uploads/Pokemon-Pokedex.png"
            })
            .setFooter({
                name: "Pokédex National | Made by Syns",
                iconURL: "https://www.g33kmania.com/wp-content/uploads/Pokemon-Pokedex.png"
            })
            .setTimestamp()

    },
//!---------------------- Warning -------------------------------
    warningEmbed: () => {
        return new MessageEmbed()
            .setColor("YELLOW")
            .setTitle("⚠️ --- **AVERTISSEMENT** --- ⚠️")
            .setTimestamp()
    },

//!---------------------- Ban -------------------------------

    banEmbed : () => {
        return new MessageEmbed()
            .setColor("#FF0000")
            .setTitle("⛔ --- **BANNISSEMENT**: --- ⛔")
            .setTimestamp()
    },
    
//!---------------------- Kick -------------------------------
    kickEmbed : () => {
        return new MessageEmbed()
            .setColor("#FF0000")
            .setTitle("🦶 --- **KICK**: --- 🦶")
            .setTimestamp()
    },
//!---------------------- Mute -------------------------------
    muteEmbed: () => {
        return new MessageEmbed()
            .setColor("#FF0000")
            .setTitle("🔇 --- **MUTE**: --- 🔇")
            .setTimestamp()
    },
    
//!---------------------- Set-channel -------------------------------
    
    setChannelEmbed: () => {
        return new MessageEmbed()
            .setColor("#71CF93")
            .setTitle("NOUVEAU SALON DÉFINI")
            .setTimestamp()
    }
    
//------------------------------------------------------------------   
    
}