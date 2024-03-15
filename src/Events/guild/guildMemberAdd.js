import Canvas  from 'canvas';
import Discord from 'discord.js';
import snekfetch from 'snekfetch';
import config from '../../config.js';


const applyText = (canvas, text) => {
    const ctx = canvas.getContext('2d');

    // Declare a base size of the font
    let fontSize = 70;

    do {
        // Assign the font to the context and decrement it so it can be measured again
        ctx.font = `${fontSize -= 10}px sans-serif`;
        // Compare pixel width of the text to the canvas minus the approximate avatar size
    } while (ctx.measureText(text).width > canvas.width - 300);

    // Return the result to use in the actual canvas
    return ctx.font;
};


export default {
    
    name: 'guildMemberAdd',
    once: false,

    async execute(member) {

        
        
        //if (!member.channel) return;

        const canvas = Canvas.createCanvas(700, 300);
        const ctx = canvas.getContext('2d');
        
        //canvas.registerFont('./src/util/font/fv_almelo-webfont.ttf', { family: 'FV Almelo' })

        const background = await Canvas.loadImage('./src/util/img/wallpaper.jpg');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#74037b';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);


        var text1 = "BIENVENUE";
        
        ctx.font = '80px FV Almelo'
        ctx.fillStyle = '#ffffff';
        var TextWidth1 = ctx.measureText(text1).width
            ctx.fillText(text1, (canvas.width/2) - (TextWidth1/2), canvas.height / 1.3);

            
        ctx.font = '54px FV Almelo'//applyText(canvas, `${member.displayName}`);
        var memberTextWidth = ctx.measureText(member.displayName).width
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${member.displayName}`, (canvas.width/2) - (memberTextWidth/2), canvas.height / 1.05);

        ctx.beginPath();
            ctx.arc(canvas.width/2, 85, 70, 0, Math.PI * 2, true);
            ctx.closePath();
        ctx.clip();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect((canvas.width/2)-100 , 0 , 200, 200);

        ctx.beginPath();
        ctx.arc(canvas.width/2, 85, 65, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        const { body: buffer } = await snekfetch.get(member.user.displayAvatarURL({format: "png"}));


        const avatar = await Canvas.loadImage(buffer);
        ctx.drawImage(avatar, (canvas.width/2)-65 , 20 , 130, 130);

        const CanvasAttachment = new Discord.AttachmentBuilder(canvas.toBuffer(), 'welcome-image.png');



        const Addembed = new Discord.EmbedBuilder()
            .setTitle("BIENVENUE")
            .setColor(0x00ff00)
            .setDescription(`Bonjour ${member} et bienvenue sur le serveur **${member.guild.name}**. Nous sommes maintenant **${member.guild.memberCount}** sur ce serveur.`)
            .setImage("attachment://welcome-image.png")
        
        try {
            
            (!config(member.guild.id).channel.bienvenueID) ? console.log("/!\\ Le channel 'bienvenue' n'est pas initialisé /!\\") : member.guild.channels.cache.get(config(member.guild.id).channel.bienvenueID).send({ embeds : [Addembed], files: [CanvasAttachment] });

        
            
            var rol = member.guild.roles.cache.find(role => role.name === "Les Louveteaux");
            member.roles.add(rol);

        }
        catch(e) {
            
            console.log(e);
            
        }

    }
}