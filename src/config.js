import db from './Models/channels.js'

export default async (guildID) => {
    // Fetch channel settings from database
    let bienvenue = null, auRevoir = null, log = null, report = null, music = null, ticket = null;
    try {
        const data = await db.findOne({ GuildID: guildID }).exec();
        if (data) {
            bienvenue = data.WelcomeChannelID || null;
            auRevoir = data.ByeChannelID || null;
            log = data.LogChannelID || null;
            report = data.ReportChannelID || null;
            music = data.MusicChannelID || null;
            ticket = data.TicketSystem || null;
        }
    } catch (err) {
        console.error(err);
    }

    return {
        channel: {
            bienvenueID: bienvenue,
            au_revoirID: auRevoir,
            logID: log,
            reportID: report,
            MusicChannelID: music,
            TicketSystem: ticket
        }
    };
};
