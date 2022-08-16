const { SlashCommandBuilder } = require("@discordjs/builders");
const {
    CommandInteraction,
    EmbedBuilder,
    ActionRowBuilder,
    MessageButton,
} = require("discord.js");
const db = require("../../Models/suggest");
const { successEmbed } = require("../../util/Embeds");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("suggest")
        .setDescription("Suggérer une commande")
        .addStringOption((option) =>
            option
                .setName("type")
                .setDescription("Le type de suggestion")
                .setRequired(true)
                .addChoices(
                    { name: "Commande", value: "Commande" },
                    { name: "Évènement", value: "Évènement" },
                    { name: "Système", value: "Système" },
                    { name: "Bug", value: "Bug" },
                    { name: "Fonctionnalité", value: "Fonctionnalité" },
                    { name: "Autres", value: "Autres" }
                )
        )
        .addStringOption((option) =>
            option
                .setName("suggestion")
                .setDescription("Décrivez votre suggestion")
                .setRequired(true)
        ),

    /**
     * @param {CommandInteraction} message
     */

    async execute(message, client) {
        const { options, guildId, member, user } = message;

        const Type = options.getString("type");
        const Suggestion = options.getString("suggestion");

        const Embed = new EmbedBuilder()
            .setTitle(`🗂️ --- Suggestion de type : ${Type} --- 🗂️`)
            .setColor("NAVY")
            .addFields(
                {
                    name: "**👤 Auteur :**",
                    value: `${user.tag} - ||${user.id}||`,
                },
                {
                    name: "**🔰 Serveur :**",
                    value: `${message.guild.name} - ||${guildId}||\n\n`,
                },
                { name: "**⁉️ Suggestion**", value: Suggestion },
                { name: "**📋 Type**", value: Type, inline: true },
                { name: "**🔷 Statut**", value: "🟠 En Attente", inline: true }
            )
            .setTimestamp();

        const Buttons = new ActionRowBuilder();

        Buttons.addComponents(
            new MessageButton()
                .setCustomId("suggest-accept")
                .setLabel("✅ Accept")
                .setStyle("SECONDARY"),
            new MessageButton()
                .setCustomId("suggest-decline")
                .setLabel("⛔ Decline")
                .setStyle("SECONDARY"),
            new MessageButton()
                .setCustomId("suggest-delete")
                .setLabel("🗑️ Delete")
                .setStyle("DANGER")
        );

        try {
            const M = await client.guilds.cache
                .get("235816886259023872")
                .channels.cache.get("915665024012419212")
                .send({
                    embeds: [Embed],
                    components: [Buttons],
                    fetchReply: true,
                });

            message.reply({
                embeds: [
                    successEmbed().setDescription(
                        "Votre suggestion a bien été envoyé"
                    ),
                ],
                ephemeral: true,
            });

            await db.create({
                GuildID: guildId,
                MessageID: M.id,
                Details: [
                    {
                        MemberID: member.id,
                        Type: Type,
                        Suggestion: Suggestion,
                        Status: "Pending",
                    },
                ],
            });
        } catch (e) {
            console.log(e);
        }
    },
};
