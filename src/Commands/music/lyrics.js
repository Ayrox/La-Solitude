const { errorEmbed, musicEmbed } from "../../util/Embeds");
const puppeteer from "puppeteer");
const { SlashCommandBuilder } from "discord.js");

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export default {
    data: new SlashCommandBuilder()
        .setName("lyrics")
        .setDescription("Affiche les paroles de la musique en cours"),

    async execute(message, client) {
        try {
            return message.reply({
                embeds: [
                    errorEmbed().setDescription(
                        `La file d'attente est actuellement vide !`
                    ),
                ],
                ephemeral: true,
            });

            //! a refaire

            //open Browser
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();
            await page.setViewport({ width: 1366, height: 768 });
            await page.goto(
                "https://www.google.com/search?q=genius+lyrics+" +
                    queue.songs[0].name.replace(/ /g, "+")
            );

            //wait and accept cookies
            await page.waitForSelector("#L2AGLb");
            await page.click("#L2AGLb");
            await sleep(500);

            //get to the lyrics page
            await page.waitForSelector("h3.LC20lb", { timeout: 10000 });
            await page.evaluate(() => {
                let elements = document.querySelectorAll("h3.LC20lb");
                elements[0].click();
            });

            //wait and accept cookies
            await sleep(1000);
            await page.waitForSelector("#onetrust-accept-btn-handler");
            await page.click("#onetrust-accept-btn-handler");
            await sleep(1000);

            //scrap the lyrics
            lyrics = await page.evaluate(() => {
                let elements = document.querySelector("#lyrics-root");
                return elements.innerText;
            });
            //if lyrics is longer than 2000 characters, send lyrics in multiple embed
            if (lyrics.length > 4000) {
                let lyricsArray = [];
                for (let i = 0; i < lyrics.length; i += 4000) {
                    lyricsArray.push(lyrics.substring(i, i + 4000));
                }

                for (let i = 0; i < lyricsArray.length; i++) {
                    message.followUp({
                        embeds: [musicEmbed().setDescription(lyricsArray[i])],
                    });
                    await sleep(1000);
                }
            } else {
                message.followUp({
                    embeds: [musicEmbed().setDescription(lyrics)],
                });
            }

            browser.close();
        } catch (e) {
            message.editReply({
                embeds: [
                    errorEmbed().setDescription(
                        `Aucune parole n'a été trouvée !`
                    ),
                ],
                ephemeral: true,
            });
            console.log(e);
        }
    },
};
