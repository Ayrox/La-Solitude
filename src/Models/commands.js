import { Schema, model } from 'mongoose';

export default model('Commands', new Schema({
    GuildID: String,
    GuildName: String,
    CommandData: Array,
}));