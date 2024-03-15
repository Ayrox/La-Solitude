const { EmbedBuilder, AttachmentBuilder, SlashCommandBuilder } from "discord.js");
const Scrapper from "images-scraper");
 

export default {
    data: new SlashCommandBuilder()
        .setName("jerem")
        .setDescription("Fait spawn un jérémie sauvage"),

    async execute(message) {
        await message.deferReply();

        let rnd = Math.floor(Math.random() * 200),
            listNB = [34, 35, 143];

        while (listNB.includes(rnd)) {
            rnd = Math.floor(Math.random() * 200);
        }

        console.log(rnd);

        await message
            .editReply({
                embeds: [
                    {
                        description: "⏳ En attente de Google Image ... ",
                        color: 0xff6800,
                    },
                ],
            })
            .then(async (resultMessage) => {
                let img_result;

                try {
                    const google = new Scrapper({
                        puppeteer: {
                            headless: true,
                            executablePath: "/usr/bin/chromium-browser",
                        },
                    });

                    img_result = await google.scrape("bearded bald guy", 200);
                } catch (e) {
                    const google = new Scrapper({
                        puppeteer: {
                            headless: true,
                        },
                    });

                    img_result = await google.scrape("chauve barbue", 200);
                }

                let baldEmbed = new EmbedBuilder()
                    .setColor(0xedb987)
                    .setDescription(`**Jérémie n°${rnd}**`)
                    .setImage(img_result[rnd].url)
                    .setTimestamp();

                resultMessage.edit({
                    embeds: [baldEmbed],
                });
            });
    },
};
