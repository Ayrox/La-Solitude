const { MessageEmbed, CommandInteraction } = require("discord.js");
const { errorEmbed } = require("../../util/Embeds")
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)); // eslint-disable-line


module.exports = {

    name: "cat",
    description: "Random Cat Pictures",
    permission: "ADMINISTRATOR",
    active: true,
    
    /**
     * 
     * @param {CommandInteraction} message 
     */
    async execute(message) {
    
        try {
        
            await message.deferReply().catch(() => { });
            
            const fetchAPI = async () => {
                const response = await fetch("https://some-random-api.ml/animal/cat", {
                    method: "GET",
                });
                return await response.json();
            }

            const data = await fetchAPI();
        

            const embed = new MessageEmbed()
                .setTitle("Cat Picture")
                .setColor("#00D7FF")
                .setDescription(data.fact)
                .setImage(data.image)
                .setFooter(`Requested by ${message.member.user.tag}`, message.member.displayAvatarURL())
                .setTimestamp();
            
            await message.editReply({ embeds: [embed] });



        } catch (err) {
            console.log(err)
            return message.editReply({ embeds: [errorEmbed().setDescription(`Une erreur est survenue`)], ephemeral: true })
        }

    },
};