const { EmbedBuilder, SlashCommandBuilder } from "discord.js");
 
// const https from "https");
// const axios from "axios");
// const config from "../../config.json");

export default {
    data: new SlashCommandBuilder()
        .setName("jules")
        .setDescription("Spawn un jules random"),

    async execute(message) {
        let jules = [
            "https://cdn.discordapp.com/attachments/867144197240520754/897925658909483028/20201103_212207.jpg",
            "https://cdn.discordapp.com/attachments/867144197240520754/897925743470870598/20210101_122954.jpg",
            "https://cdn.discordapp.com/attachments/867144197240520754/897925234785648681/20210725_035512.jpg",
            "https://cdn.discordapp.com/attachments/867144197240520754/897925235154776114/20210711_180431.jpg",
            "https://cdn.discordapp.com/attachments/867144197240520754/897925235720994886/20210711_1741480.jpg",
            "https://cdn.discordapp.com/attachments/867144197240520754/897925236350128128/20210523_150924.jpg",
            "https://cdn.discordapp.com/attachments/867144197240520754/897925236979281930/20210512_143557.jpg",
            "https://cdn.discordapp.com/attachments/867144197240520754/897925237432279070/20210101_144144.jpg",
            "https://cdn.discordapp.com/attachments/867144197240520754/897925238346625035/20201017_134007.jpg",
            "https://cdn.discordapp.com/attachments/867144197240520754/897925601535610920/20201011_221352.jpg",
        ];

        var random = Math.floor(Math.random() * jules.length);

        message.reply({
            embeds: [
                new EmbedBuilder().setImage(jules[random]).setColor("#FF00B9"),
            ],
        });
    },
};
