const { EmbedBuilder, CommandInteraction, SlashCommandBuilder } from "discord.js");
const conf from "../../config.js");
const { errorEmbed } from "../../util/Embeds");
 

export default {
    data: new SlashCommandBuilder()
        .setName("report")
        .setDescription("Signaler un membre du serveur")
        .addUserOption((option) =>
            option
                .setName("membre")
                .setDescription(`Le membre à signaler`)
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("raison")
                .setDescription(`Raison du signalement`)
                .setRequired(true)
        ),

    async execute(message) {
        let config = await conf(message.guild.id);

        let rUser = message.options.getMember("member");

        //console.log(rUser)

        if (!rUser)
            return message.channel.send({
                embeds: [
                    {
                        color: 0xff0000,
                        description: ` ${message.member} \n **Erreur**: \n Ce membre est introuvable.`,
                    },
                ],
            });

        let rreason = message.options.getString("reason");
        if (!rreason) {
            rreason = "Aucune raison n'a été indiqué";
        }

        let reportEmbed = new EmbedBuilder()
            .setTitle(":satellite: Signalement Détecté :satellite:")
            .setColor("#000000")
            .addFields(
                {
                    name: "Membre signalé : ",
                    value: `${rUser}`,
                    inline: true
                },
                {
                    name:"Signalé par : ",
                    value: `${message.user}`,
                    inline: true
                },
                {
                    name:"Dans le salon : ",
                    value: `<#${message.channel.id}>`,
                    inline: true
                },
                {
                    name: "Date : ",
                    value: `<t:${parseInt(message.createdAt / 1000)}:R>`,
                    inline: true
                },
                {
                    name: "Raison : ",
                    value: `${rreason}`
                }
            );

        let reportschannel = !config.channel.reportID
            ? null
            : message.guild.channels.cache.get(config.channel.reportID);

        console.log(config.channel.reportID);
        console.log(reportschannel);

        if (!reportschannel) {
            return message.reply({
                embeds: [
                    errorEmbed().setDescription(
                        `le salon de "report" n'est pas initialisé. \n\n _Pour l'initialiser vous pouvez utiliser la commande_ \`/set-channel report\`\n_**ADMIN ONLY**_`
                    ),
                ],
                ephemeral: true,
            });
        } else {
            reportschannel.send({ embeds: [reportEmbed] });
        }

        message.reply({
            content: "Votre report a bien été reçu !",
            ephemeral: true,
        });
    },
};
