import { Schema, model } from 'mongoose'

export default model('Channels', new Schema({

    GuildID: String,
    LogChannelID: String,
    ReportChannelID: String,
    WelcomeChannelID: String,
    ByeChannelID: String,
    MusicChannelID: String,

    TicketSystem: Object,
    
}))

