 
import { CommandInteraction, EmbedBuilder, Client, SlashCommandBuilder } from "discord.js";
import { connection } from "mongoose";

export default {
    data: new SlashCommandBuilder()
        .setName("status")
        .setDescription("Affiche le statut du Bot et de la base de données"),

    /**
     *
     * @param {CommandInteraction} message
     * @param {Client} client
     */
    async execute(message, client) {
        const Response = new EmbedBuilder()
            .setColor("#0099ff")
            .setTitle("🤖 --- Statut du Bot --- 🤖")
            .addFields(
                {
                    name: "Client :",
                    value: `\`🟢 EN LIGNE\` - \`${client.ws.ping} ms\``,
                    inline: true
                },
                {
                    name: "Base de Donnée :",
                    value: `\`${getStatus(connection.readyState)}\``,
                    inline: true
                },
                {
                    name: "Temps de Fonctionnement",
                    value: `<t:${parseInt(client.readyTimestamp / 1000)}:R>`,
                    inline: true
                }
            )
            .setTimestamp();

        message.reply({ embeds: [Response] });
    },
};

function getStatus(val) {
    let status = "";

    switch (val) {
        case 0:
            status = `🔴 HORS LIGNE`;
            break;
        case 1:
            status = `🟢 CONNECTÉ`;
            break;
        case 2:
            status = `🟠 EN ATTENTE DE CONNEXION`;
            break;
        case 3:
            status = `🔵 EN ATTENTE DE DECONNEXION`;
            break;
    }
    return status;
}
