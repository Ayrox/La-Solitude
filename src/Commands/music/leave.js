import { getVoiceConnection } from "@discordjs/voice";
import * as Embed from "../../util/Embeds.js";
import { SlashCommandBuilder, MessageFlags } from "discord.js";

export const command = {
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Quitte le salon vocal"),

    async execute(message, client) {
        if (!message.member.voice.channel)
            return message.reply({
                embeds: [
                    Embed.errorEmbed().setDescription(
                        `Vous devez d'abord rejoindre le salon vocal où le BOT se trouve de préférence.`
                    ),
                ],
                flags: MessageFlags.Ephemeral,
            });

        if (!message.guild.members.me.voice.channel)
            return message.reply({
                embeds: [
                    Embed.errorEmbed().setDescription(
                        `Le Bot n'est pas connecter dans un salon vocal`
                    ),
                ],
                flags: MessageFlags.Ephemeral,
            });

        if (
            message.guild.members.me.voice.channel.id !==
            message.member.voice.channel.id
        )
            return message.reply({
                flags: MessageFlags.Ephemeral,
                embeds: [
                    Embed.errorEmbed().setDescription(
                        `Vous n'êtes pas dans le même salon que le bot.`
                    ),
                ],
            });

        try {
            let disconnected = false;

            // Méthode 1: Utiliser DisTube pour quitter le salon vocal
            const queue = client.distube.getQueue(message.guild.id);
            if (queue) {
                try {
                    await client.distube.voices.leave(message.guild.id);
                    console.log(`[${new Date().toISOString()}] [COMMAND] [LEAVE] [INFO] DisTube voice connection fermée.`);
                    disconnected = true;
                } catch (distubeError) {
                    console.log(`[${new Date().toISOString()}] [COMMAND] [LEAVE] [WARNING] Erreur DisTube leave:`, distubeError.message);
                    // Essayer d'arrêter la queue
                    try {
                        client.distube.stop(message.guild.id);
                        console.log(`[${new Date().toISOString()}] [COMMAND] [LEAVE] [INFO] Queue DisTube arrêtée.`);
                    } catch (stopError) {
                        console.log(`[${new Date().toISOString()}] [COMMAND] [LEAVE] [WARNING] Erreur arrêt queue:`, stopError.message);
                    }
                }
            }

            // Méthode 2: Utiliser getVoiceConnection pour détruire la connexion
            const connection = getVoiceConnection(message.guild.id);
            if (connection) {
                try {
                    connection.destroy();
                    console.log(`[${new Date().toISOString()}] [COMMAND] [LEAVE] [INFO] Connexion vocale @discordjs/voice détruite.`);
                    disconnected = true;
                } catch (connectionError) {
                    console.log(`[${new Date().toISOString()}] [COMMAND] [LEAVE] [WARNING] Erreur destruction connexion:`, connectionError.message);
                }
            }

            // Méthode 3: Forcer la déconnexion via le guild member
            if (!disconnected && message.guild.members.me.voice.channel) {
                try {
                    await message.guild.members.me.voice.disconnect();
                    console.log(`[${new Date().toISOString()}] [COMMAND] [LEAVE] [INFO] Déconnexion forcée via guild member.`);
                    disconnected = true;
                } catch (guildError) {
                    console.log(`[${new Date().toISOString()}] [COMMAND] [LEAVE] [WARNING] Erreur déconnexion guild:`, guildError.message);
                }
            }

            if (disconnected) {
                console.log(`[${new Date().toISOString()}] [COMMAND] [LEAVE] [INFO] Commande 'leave' exécutée avec succès. Salon vocal quitté.`);
            } else {
                console.log(`[${new Date().toISOString()}] [COMMAND] [LEAVE] [WARNING] Aucune méthode de déconnexion n'a fonctionné.`);
            }

            // Vérification finale : Le bot est-il encore connecté ?
            setTimeout(async () => {
                if (message.guild.members.me.voice.channel) {
                    console.log(`[${new Date().toISOString()}] [COMMAND] [LEAVE] [WARNING] Bot toujours connecté, tentative de déconnexion finale...`);
                    try {
                        // Dernière tentative avec setChannel(null)
                        await message.guild.members.me.voice.setChannel(null);
                        console.log(`[${new Date().toISOString()}] [COMMAND] [LEAVE] [INFO] Déconnexion finale réussie via setChannel(null).`);
                    } catch (finalError) {
                        console.log(`[${new Date().toISOString()}] [COMMAND] [LEAVE] [ERROR] Déconnexion finale échouée:`, finalError.message);
                    }
                } else {
                    console.log(`[${new Date().toISOString()}] [COMMAND] [LEAVE] [INFO] Vérification : Bot bien déconnecté du salon vocal.`);
                }
            }, 1000); // Attendre 1 seconde avant de vérifier

        } catch (error) {
            console.log(`[${new Date().toISOString()}] [COMMAND] [LEAVE] [ERROR] Erreur générale lors de la déconnexion:`, error);
        }

        message.reply({
            embeds: [
                {
                    color: 0x25e325,
                    description: "👋 **SALAM**",
                },
            ],
            flags: MessageFlags.Ephemeral,
        });
    },
};
