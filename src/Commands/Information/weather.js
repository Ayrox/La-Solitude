 
const { EmbedBuilder, SlashCommandBuilder } from "discord.js");
const weather from "weather-js");
const { errorEmbed } from "../../util/Embeds");

export default {
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
        weather.find(
            { search: message.options.getString("ville"), degreeType: "C" },
            (error, result) => {
                if (error)
                    return message.reply({
                        embeds: [errorEmbed().setDescription(`${error}`)],
                        ephemeral: true,
                    });

                if (result === undefined || result.length === 0)
                    return message.reply({
                        embeds: [
                            errorEmbed().setDescription(
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
