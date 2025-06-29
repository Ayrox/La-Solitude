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
                "https://media.discordapp.net/attachments/752592289104265326/1388970434552270959/1000003158.jpg",
                "https://media.discordapp.net/attachments/752592289104265326/1388970435089137765/1000001543.jpg",
                "https://media.discordapp.net/attachments/752592289104265326/1388970435437269102/1000001972.jpg",
                "https://media.discordapp.net/attachments/752592289104265326/1388970436120809623/1000002568.jpg",
                "https://media.discordapp.net/attachments/752592289104265326/1388970436439838831/1000002604.jpg",
                "https://media.discordapp.net/attachments/752592289104265326/1388970436704075796/1000002854.jpg",
                "https://media.discordapp.net/attachments/752592289104265326/1388970437089693828/1000002928.jpg",
                "https://media.discordapp.net/attachments/752592289104265326/1388970437475831908/1000002930.jpg",
                "https://media.discordapp.net/attachments/752592289104265326/1388970437773623356/1000003157.jpg",
                "https://media.discordapp.net/attachments/752592289104265326/1388970482262605946/1000008022.jpg",
                "https://media.discordapp.net/attachments/752592289104265326/1388970482547687444/1000003159.jpg",
                "https://media.discordapp.net/attachments/752592289104265326/1388970482908266659/1000003201.jpg",
                "https://media.discordapp.net/attachments/752592289104265326/1388970483252330658/1000003537.jpg",
                "https://media.discordapp.net/attachments/752592289104265326/1388970483856183357/1000003798.jpg",
                "https://media.discordapp.net/attachments/752592289104265326/1388970484426604584/1000004262.jpg",
                "https://media.discordapp.net/attachments/752592289104265326/1388970484158300310/1000004140.jpg",
                "https://media.discordapp.net/attachments/752592289104265326/1388970484716015696/1000004341.jpg",
                "https://media.discordapp.net/attachments/752592289104265326/1388970667394728166/1000024625.jpg",
                "https://media.discordapp.net/attachments/752592289104265326/1388970667843649637/1000008023.jpg",
                "https://media.discordapp.net/attachments/752592289104265326/1388970668275531827/1000018120.jpg",
                "https://media.discordapp.net/attachments/752592289104265326/1388970668762337340/1000018163.jpg",
                "https://media.discordapp.net/attachments/752592289104265326/1388970669940932708/1000018501.jpg",
                "https://media.discordapp.net/attachments/752592289104265326/1388970671807402204/1000018508.jpg",
                "https://media.discordapp.net/attachments/752592289104265326/1388970673099243620/1000018510.jpg",
                "https://media.discordapp.net/attachments/752592289104265326/1388970673925390356/1000019013.jpg",
                "https://media.discordapp.net/attachments/752592289104265326/1388970674789548132/1000021566.jpg",
                "https://media.discordapp.net/attachments/752592289104265326/1388970675665899561/1000024149.jpg",
                "https://media.discordapp.net/attachments/752592289104265326/1388970734465847436/1000029957.jpg",
                "https://media.discordapp.net/attachments/752592289104265326/1388970734906380318/1000025037.jpg",
                "https://media.discordapp.net/attachments/752592289104265326/1388970735384527028/1000025130.jpg"
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
