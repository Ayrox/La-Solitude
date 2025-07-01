import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import weather from "weather-js";
import * as Embed from "../../Util/Embeds.js";

export const command = {
    data: new SlashCommandBuilder()
        .setName("weather")
        .setDescription("Affiche la météo")
        .addStringOption((option) =>
            option
                .setName("ville")
                .setDescription(`La ville où vous voulez connaître la météo`)
                .setRequired(true)
        ),

    execute(message, client) {
        console.log(`[${new Date().toISOString()}] [COMMAND] [WEATHER] [INFO] Météo demandée pour la ville : ${message.options.getString("ville")}`);
        weather.find(
            { search: message.options.getString("ville"), degreeType: "C" },
            (error, result) => {
                if (error)
                    return message.reply({
                        embeds: [Embed.errorEmbed().setDescription(`${error}`)],
                        ephemeral: true,
                    });

                if (result === undefined || result.length === 0)
                    return message.reply({
                        embeds: [
                            Embed.errorEmbed().setDescription(
                                `Localisation invalide`
                            ),
                        ],
                        ephemeral: true,
                    });

                let current = result[0].current;
                let location = result[0].location;
                let forecast = result[0].forecast;

                let ressentieEmoji =
                    current.temperature > current.feelslike
                        ? "🥵"
                        : current.temperature > current.feelslike
                        ? "🔸"
                        : "🥶";

                const resultEmbed = new EmbedBuilder()
                    .setColor("#111111")
                    .setTitle(
                        `Prévisions météorologiques pour ${current.observationpoint} à ${current.observationtime}`
                    )
                    .setThumbnail(current.imageUrl)
                    .setDescription(`**${current.skytext}**`)
                    .addFields(
                        {
                            name: "🕜 Fuseau Horaire :",
                            value: `UTC ${location.timezone}`,
                            inline: true
                        },
                        {
                            name: "🔹 Type de degrée :",
                            value: `Celsius`,
                            inline: true
                        },
                        {
                            name: "🌡️ Température :",
                            value: `${current.temperature}°C`,
                            inline: true
                        },
                        {
                            name: `${ressentieEmoji} Ressentie :`,
                            value: `${current.feelslike}°C`,
                            inline: true
                        },
                        {
                            name: "💨 Vent :",
                            value: `${current.winddisplay}`,
                            inline: true
                        },
                        {
                            name: "💧 Humidité :",
                            value: `${current.humidity}%`,
                            inline: true
                        }
                    )
                    .setTimestamp();

                message.reply({ embeds: [resultEmbed] });
            }
        );
    },
};
