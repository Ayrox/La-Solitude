import { Schema, model } from 'mongoose'

export default model('Tickets', new Schema({

    GuildID: String,
    MemberID: String,
    TicketID: String,
    ChannelID: String,
    Closed: Boolean,
    Locked: Boolean,
    Type: String,
    
}));

