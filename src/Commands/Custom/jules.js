import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
 
// import https from "https";
// import axios from "axios";
// import config from "../../config.json";

export const command = {
    data: new SlashCommandBuilder()
        .setName("jules")
        .setDescription("Spawn un jules random"),

    async execute(message) {
        try {
            let jules = [
                "https://cdn.discordapp.com/attachments/867144197240520754/897925658909483028/20201103_212207.jpg",
                "https://cdn.discordapp.com/attachments/867144197240520754/897925743470870598/20210101_122954.jpg",
                "https://cdn.discordapp.com/attachments/867144197240520754/897925234785648681/20210725_035512.jpg",
                "https://cdn.discordapp.com/attachments/867144197240520754/897925235154776114/20210711_180431.jpg",
                "https://cdn.discordapp.com/attachments/867144197240520754/897925235720994886/20210711_1741480.jpg",
            ];

            const randomJules = jules[Math.floor(Math.random() * jules.length)];

            const embed = new EmbedBuilder()
                .setTitle("Un Jules sauvage apparaît !")
                .setImage(randomJules)
                .setColor(0xff6800);

            await message.reply({ embeds: [embed] });
        } catch (error) {
            console.error("❌ Une erreur s'est produite dans la commande 'jules' :", error);
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
