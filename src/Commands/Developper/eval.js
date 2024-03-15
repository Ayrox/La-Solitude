const { CommandInteraction, SlashCommandBuilder } from "discord.js");
const { errorEmbed } from "../../util/Embeds");
 

const clean = (text) => {
    if (typeof text === "string")
        return text
            .replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/g, "@" + String.fromCharCode(8203));
    else return text;
};

export default {
    data: new SlashCommandBuilder()
        .setName("eval")
        .setDescription("eval")
        .addStringOption((option) =>
            option.setName("code").setDescription("code").setRequired(true)
        ),

    /**
     * @param {CommandInteraction} message
     */

    async execute(message) {
        if (message.member.id !== "206905331366756353")
            return message.reply({
                embed: [
                    errorEmbed().setDescription(
                        "Vous devez être le propriétaire du Bot pour utiliser cette commande !"
                    ),
                ],
            });

        let code = message.options.getString("code");

        try {
            let evaled = eval(code);

            if (typeof evaled !== "string")
                evaled from "util").inspect(evaled);

            message.channel.send(clean(evaled), { code: "xl" });
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
        }
    },
};
