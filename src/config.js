import db from './Models/channels.js'




export default async (guildID) => {
  
    //fetch channel from database and store in global variable
    let bienvenue, auRevoir, log, report, music, ticket
    
    
    await db.findOne({ GuildID: guildID }, async (err, data) => {
    
        if (err) console.log(err)

        if (data) {

        bienvenue = (data.WelcomeChannelID) ? data.WelcomeChannelID : null
        auRevoir = (data.ByeChannelID) ? data.ByeChannelID : null
        log = (data.LogChannelID) ? data.LogChannelID : null
        report = (data.ReportChannelID) ? data.ReportChannelID : null
        music = (data.MusicChannelID) ? data.MusicChannelID : null
        ticket = (data.TicketSystem) ? data.TicketSystem : null

        }
        
    }).clone()

    
  


    //console.log(bienvenue, auRevoir, log, report, music);
    
    return {
        channel: {
            bienvenueID: bienvenue,
            au_revoirID:  auRevoir,
            logID: log,
            reportID: report,
            MusicChannelID: music,
            TicketSystem: ticket
        
        },

    }
}
