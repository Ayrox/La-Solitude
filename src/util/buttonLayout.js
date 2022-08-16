const { ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
    //------------------------ Music -------------------------------
    musicButtonRow: () => {
        return new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("⏮️")
                .setCustomId(`previous`)
                .setStyle("Secondary"),
            new ButtonBuilder()
                .setLabel("⏯️")
                .setCustomId(`pause`)
                .setStyle("Secondary"),
            new ButtonBuilder()
                .setLabel("⏭️")
                .setCustomId(`skip`)
                .setStyle("Secondary")
        );
    },

    musicButtonRow2: () => {
        return new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("🔀")
                .setCustomId(`shuffle`)
                .setStyle("Secondary"),
            new ButtonBuilder()
                .setLabel("🔁")
                .setCustomId(`repeat`)
                .setStyle("Secondary"),
            new ButtonBuilder()
                .setLabel("❤️")
                .setCustomId(`like`)
                .setStyle("Secondary")
        );
    },
};
