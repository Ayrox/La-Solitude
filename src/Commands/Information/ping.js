const { SlashCommandBuilder } from "discord.js");

export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Retourne le ping du bot"),

    execute(message, client) {
        try {
            message
                .reply({
                    embeds: [
                        {
                            color: 0xffffff,
                            description: "Calcul du ping en cours ...",
                        },
                    ],
                    ephemeral: true,
                    fetchReply: true,
                })
                .then((m) => {
                    message.editReply({
                        embeds: [
                            {
                                description: `Latence du Bot : ${
                                    m.createdTimestamp -
                                    message.createdTimestamp
                                } ms , Latence de l'API : ${
                                    client.ws.ping
                                }  ms`,
                            },
                        ],
                    });
                });
        } catch (e) {
            console.log(e);
            message.reply({
                embeds: [errorEmbed().setDescription(`${e}`)],
                ephemeral: true,
            });
        }
    },
};
