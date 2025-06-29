import pkg, { SlashCommandBuilder } from 'discord.js';
// Use flags for ephemeral responses
const { InteractionResponseFlags } = pkg;

export const command = {
    data: new SlashCommandBuilder()
        .setName('test-event')
        .setDescription('Déclenche un événement pour tester les handlers')
        .addStringOption(option =>
            option.setName('event')
                .setDescription('Le nom de l\'événement à déclencher')
                .setRequired(true)
        ),

    async execute(interaction) {
        console.log(`[COMMAND] [TEST_EVENT] ${interaction.user.tag} déclenche l'événement ${interaction.options.getString('event')}`);
        const eventName = interaction.options.getString('event');
        // Map des arguments pour certains événements
        const argsMap = {
            guildMemberAdd: [interaction.member],
            guildMemberRemove: [interaction.member],
            channelCreate: [interaction.channel],
            messageCreate: [interaction],
        };
        const args = argsMap[eventName] || [];
        try {
            await interaction.reply({ content: `Événement \`${eventName}\` déclenché.`, flags: InteractionResponseFlags.Ephemeral });
            interaction.client.emit(eventName, ...args);
        } catch (error) {
            console.error(`Erreur lors du déclenchement de l'événement ${eventName}:`, error);
            if (!interaction.replied) await interaction.reply({ content: `❌ Impossible de déclencher l'événement \`${eventName}\`.`, flags: InteractionResponseFlags.Ephemeral });
        }
    }
};
