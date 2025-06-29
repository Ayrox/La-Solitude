import { Client } from "discord.js";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const client = new Client({ intents: [] });

// Mock the client.users.fetch method
client.users = {
    fetch: async (id) => {
        console.log(`[${new Date().toISOString()}] [TEST] [COMMANDS] [INFO] Fetching user with ID: ${id}`);
        return {
            avatarURL: () => "https://example.com/avatar.png",
        };
    },
};

// Charger les commandes
const commands = new Map();
const commandFiles = fs.readdirSync("./src/commands").flatMap(folder => {
    const folderPath = `./src/commands/${folder}`;
    return fs.readdirSync(folderPath).map(file => `${folderPath}/${file}`);
});

for (const file of commandFiles) {
    const { command } = await import(`file://${process.cwd()}/${file}`);
    commands.set(command.data.name, command);
}

// Tester les commandes
(async () => {
    console.log(`[${new Date().toISOString()}] [TEST] [COMMANDS] [INFO] Début des tests des commandes Discord...`);

    for (const [name, command] of commands) {
        try {
            console.log(`[${new Date().toISOString()}] [TEST] [COMMANDS] [INFO] Test de la commande : ${name}`);
            const mockInteraction = {
                options: {
                    getString: () => "mockString",
                    getNumber: () => 1,
                    getBoolean: () => true,
                },
                client: client, // Pass the mocked client object
                reply: async (message) => console.log(`[${new Date().toISOString()}] [TEST] [COMMANDS] [INFO] Réponse simulée : ${message}`),
                deferReply: async () => console.log(`[${new Date().toISOString()}] [TEST] [COMMANDS] [INFO] Réponse différée simulée.`),
                editReply: async (message) => console.log(`[${new Date().toISOString()}] [TEST] [COMMANDS] [INFO] Réponse éditée simulée : ${message}`),
            };

            await command.execute(mockInteraction, client);
            console.log(`[${new Date().toISOString()}] [TEST] [COMMANDS] [INFO] Commande ${name} testée avec succès !\n`);
        } catch (error) {
            console.error(`Erreur lors du test de la commande ${name} :`, error);
        }
    }

    console.log(`[${new Date().toISOString()}] [TEST] [COMMANDS] [INFO] Tests terminés.`);
    process.exit(0);
})();