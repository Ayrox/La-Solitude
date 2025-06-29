import { SlashCommandBuilder } from "discord.js";

export const command = {
    data: new SlashCommandBuilder()
        .setName("testing")
        .setDescription("testing"),

    async execute(message, client) {
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

            client.emit("guildMemberAdd", message.member);
            // Uncomment the line below to test guildMemberRemove
            // client.emit("guildMemberRemove", message.member);

            await message.reply({
                content: "✅ Test effectué avec succès.",
                ephemeral: true,
            });
        } catch (error) {
            console.error(`[${new Date().toISOString()}] [COMMAND] [TESTING] [ERROR] Une erreur s'est produite dans la commande 'testing' :`, error);
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
