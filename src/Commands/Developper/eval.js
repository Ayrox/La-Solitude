import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import * as Embed from "../../Util/Embeds.js";
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const clean = (text) => {
    if (typeof text === "string")
        return text
            .replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/g, "@" + String.fromCharCode(8203));
    else return text;
};

export const command = {
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
        try {
            if (message.member.id !== "206905331366756353") {
                return message.reply({
                    embeds: [
                        {
                            description: "❌ Vous devez être le propriétaire du Bot pour utiliser cette commande !",
                            color: 0xff0000,
                        },
                    ],
                });
            }

            const code = message.options.getString("code");
            let evaled = eval(code);

            if (typeof evaled !== "string") {
                evaled = require("util").inspect(evaled);
            }

            await message.reply({
                content: `\`\`\`js\n${evaled}\n\`\`\``,
                ephemeral: true,
            });
        } catch (error) {
            console.error(`[${new Date().toISOString()}] [COMMAND] [EVAL] [ERROR] Une erreur s'est produite dans la commande 'eval' :`, error);
            await message.reply({
                embeds: [
                    {
                        description: "❌ Une erreur inattendue s'est produite. Veuillez réessayer plus tard.",
                        color: 0xff0000,
                    },
                ],
            });
        }
    },
};
