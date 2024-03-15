import { Schema, model } from 'mongoose'

export default model('Suggest', new Schema({

    GuildID: String,
    MessageID: String,
    Details: Array,
    
}));

