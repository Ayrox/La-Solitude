import { Schema, model } from "mongoose";

export default model(
    "Playlist",
    new Schema({
        UserID: String,
        PlaylistID: String,
        SongName: String,
        SongUrl: String,
    })
);
