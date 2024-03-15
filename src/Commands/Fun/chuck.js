const { CommandInteraction, EmbedBuilder, Client, SlashCommandBuilder } from "discord.js");
const { errorEmbed } from "../../util/Embeds");
const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args)); // eslint-disable-line
const cheerio from "cheerio");
const https from "https");
 
export default {
    data: new SlashCommandBuilder()
        .setName("chuck")
        .setDescription("Chuck Norris facts")
        .addNumberOption((option) =>
            option
                .setName("combien")
                .setDescription("Le maximum de Chuck Norris facts à afficher.")
                .setRequired(true)
        ),

    /**
     *
     *
     * @param {CommandInteraction} message
     * @param {Client} client
     *
     */
    async execute(message, client) {
        let MaxNUM = message.options.getNumber("combien") || 1;

        await message.deferReply();
        const agent = new https.Agent({
            rejectUnauthorized: false,
          });


        await message
            .editReply({
                embeds: [{ description: "⏳ Chargement... ", color: 0xff6800 }],
            })
            .then(async (resultMessage) => {
                const fetchAPI = async () => {
                    const response = await fetch(
                        `https://chucknorrisfacts.fr/facts/random`,
                        {
                            method: "GET",
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            agent,
                        }
                    ).catch();

                    return await response.text();
                };

                const data = await fetchAPI();

                const $ = cheerio.load(data);

                let facts = [];

                for (let i = 0; i < MaxNUM; i++) {
                    let fact = $(".card-text").toArray()[i].children[0].data;
                    let note = $("span").toArray()[i].children[0].data;
                    let id = $("a")
                        .toArray()
                        .filter(
                            (a) =>
                                a.attribs.href !== undefined &&
                                a.attribs.href.includes("/voir_fact/")
                        )[i].children[0].data;

                    facts.push({
                        id: id,
                        fact: fact,
                        note: note,
                    });
                }

                const chuckEmbed = new EmbedBuilder()
                    .setTitle("Chuck Norris Facts")
                    .setColor(0xff6800)
                    .setThumbnail(
                        "https://chucknorrisfacts.fr/static/img/cn_pa.png"
                    )
                    .setFooter({
                        text :"Chuck Norris Facts"
                    })
                    .setTimestamp();

                facts.forEach((f) => {
                    chuckEmbed.addFields({
                        name: `\`Fact ${f.id}\``,
                        value :`${f.fact}\n_Note: ${f.note}_`
                    });
                });

                resultMessage.edit({ embeds: [chuckEmbed] });
            });
    },
};
