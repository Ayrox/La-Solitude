import { EmbedBuilder, AttachmentBuilder, SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import Scrapper from "images-scraper";


export const command = {
    data: new SlashCommandBuilder()
        .setName("jerem")
        .setDescription("Fait spawn un jérémie sauvage"),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        
        await interaction.deferReply();

        let rnd = Math.floor(Math.random() * 200),
            listNB = [34, 35, 143];

        while (listNB.includes(rnd)) {
            rnd = Math.floor(Math.random() * 200);
        }

        console.log(rnd);

        await interaction
            .editReply({
                embeds: [
                    {
                        description: "⏳ En attente de Google Image ... ",
                        color: 0xff6800,
                    },
                ],
            })
            .then(async (resultMessage) => {
                var img_result;

                const google = new Scrapper({
                    puppeteer: {
                        headless: false,
                    },
                });

                try {

                    img_result = await google.scrape("bearded bald guy", 200);
                    console.log('results', img_result);
                    
                    
                } catch (e) {
                    console.log(e)
                    img_result = await google.scrape("chauve barbue", 200);
                    console.log(img_result)
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
