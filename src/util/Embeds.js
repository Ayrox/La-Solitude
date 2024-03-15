import { EmbedBuilder,} from "discord.js";
import OP from './OnePieceData.json'

export default {
    
//!------------------------ ERROR -------------------------------    
    errorEmbed: () => {
        
        return new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("⛔ **Erreur**: ⛔")
            .setTimestamp()
        
    },

//!------------------------ SUCCESS -------------------------------
    successEmbed: () => {
            
            return new EmbedBuilder()
                .setColor("#00FF00")
                .setTitle("✅ **Success**: ✅")
                .setTimestamp()

    },

//!------------------------ Music -------------------------------    
    musicEmbed: () => {
        return new EmbedBuilder()
            .setColor("#7F00FF")
            .setAuthor({
                name:"Spotifion",
                iconURL: "https://www.iconsdb.com/icons/preview/violet/spotify-xxl.png"
            })
            .setTimestamp()
    },
//!---------------------- POKEMON -------------------------------
    pokemonEmbed: () => {
        return new EmbedBuilder()
            .setAuthor({
                name: "POKÉDEX NATIONAL",
                iconURL: "https://www.g33kmania.com/wp-content/uploads/Pokemon-Pokedex.png"
            })
            .setFooter({
                text: "Pokédex National | Made by Syns",
                iconURL: "https://www.g33kmania.com/wp-content/uploads/Pokemon-Pokedex.png"
            })
            .setTimestamp()
        
    },

    pokemonEasterEggEmbed: () => {
        return new EmbedBuilder()
            .setColor("#FF0000")
            .setAuthor({
                name: "POKÉDEX NATIONAL",
                iconURL: "https://www.g33kmania.com/wp-content/uploads/Pokemon-Pokedex.png"
            })
            .setFooter({
                text: "Pokédex National | Made by Syns",
                iconURL: "https://www.g33kmania.com/wp-content/uploads/Pokemon-Pokedex.png"
            })
            .setTimestamp()

    },
//!---------------------- Warning -------------------------------
    warningEmbed: () => {
        return new EmbedBuilder()
            .setColor("Yellow")
            .setTitle("⚠️ --- **AVERTISSEMENT** --- ⚠️")
            .setTimestamp()
    },

//!---------------------- Ban -------------------------------

    banEmbed : () => {
        return new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("⛔ --- **BANNISSEMENT**: --- ⛔")
            .setTimestamp()
    },
    
//!---------------------- Kick -------------------------------
    kickEmbed : () => {
        return new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("🦶 --- **KICK**: --- 🦶")
            .setTimestamp()
    },
//!---------------------- Mute -------------------------------
    muteEmbed: () => {
        return new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("🔇 --- **MUTE**: --- 🔇")
            .setTimestamp()
    },
    
//!---------------------- Set-channel -------------------------------
    
    setChannelEmbed: () => {
        return new EmbedBuilder()
            .setColor("#71CF93")
            .setTitle("NOUVEAU SALON DÉFINI")
            .setTimestamp()
    },
//!---------------------- One Piece -------------------------------
    
    OnePieceEmbed: (member) => {
        return new EmbedBuilder()
            .setColor("White")
            .setAuthor({name: `☠️ ---- PERSONNAGE ONE PIECE DE ${member.toUpperCase()} ---- ☠️`})
            .addFields(
                {name: "__Grade :__", value: "...", inline: true},
                {name: "__Camp :__", value: "...", inline: true},
                {name: "__Race :__", value: "...", inline: true},
                {name: "__Région d'origine :__", value: "...", inline: true},
                {name: "__Force :__", value: "...", inline: true},
                {name: "__Intelligence :__", value: "...", inline: true},
                {name: "__Vitesse :__", value: "...", inline: true},
                {name: "__Haki :__", value: "...", inline: true},
                {name: "__Fruit du démon :__", value: "..."},
                {name: "__Prime :__", value: "..."},

            )
            .setThumbnail(OP.noFruitURL)
            .setTimestamp()
            
}
//------------------------------------------------------------------   
    
}