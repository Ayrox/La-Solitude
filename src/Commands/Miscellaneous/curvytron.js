const { MessageEmbed, MessageAttachment, MessageButton, MessageActionRow } = require("discord.js");
const puppeteer = require("puppeteer");
require("isomorphic-fetch");
import { GiphyFetch } from '@giphy/js-fetch-api'
const gf = new GiphyFetch('0UTRbFtkMxAplrohufYco5IY74U8hOes')
// const fs = require("fs/promises");

module.exports = {
  name: "curvytron",
  description: "Lance une room curvytron",
  permission: "ADMINISTRATOR",
  active: true,

  async execute(message) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto("http://www.curvytron.com/#/"); //navigate to curvyton website
    await new Promise(r => setTimeout(r, 500));
    
    await page.click("#submit"); //create room
    await new Promise(r => setTimeout(r, 500));
    
    await page.type("#profile-name", "VFX-BOT"); //set profile name
    await new Promise(r => setTimeout(r, 500));
    
    await page.click("#profile > div.profile-form.ng-scope > div > div > button"); //confirm profile
    await new Promise(r => setTimeout(r, 500));
    
    await page.click(".icon-params"); //open settings
    await new Promise(r => setTimeout(r, 500));
    
    await page.click("#open"); //set room as private
    await new Promise(r => setTimeout(r, 500));

    const url = await page.url();
    const password = url.split("=").pop();

    console.log(url);
    console.log(password);

    message.reply("lol");
    // message.channel.send(url);
    message.channel.send("Password : "+ password);

    // await page.screenshot({path: 'test.png', fullPage:true}); //screenshot
    
    console.log('ready, waiting for players');
    // message.channel.send("ready, waiting for players");
    
    while (true) {
        const playerNumber = await page.$$eval(".player-name", (players) => {
            return players.length - 1;
        })
        
        const ready = await page.$$eval(".ready", (ready) => {
            return ready.length;
        })
        
        if (playerNumber > 1 && playerNumber === ready) {
            break
        }
        
        // console.log(playerNumber + " " + ready);
    }
    
    console.log("party launch !");
    // message.channel.send("party launch !");

    await browser.close();

    // const photos = await page.$$eval("img", (imgs) => {
    //     return imgs.map(x => x.src);
    // })

    // console.log(photos);

    // for(const photo of photos) {
    //     const imagepage = await page.goto(photo);
    //     let path = photo.split('?').shift();
    //     await fs.writeFile(path.split("/").pop(), await imagepage.buffer());
    // }
  },
};
