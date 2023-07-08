import mongoose from "mongoose";

const Schema = mongoose.Schema;

const NotesSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    duedate: {
        type: String,
        required: true,
    },
    prio: {
        type: Number,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    createdAt: {
        type: String,
    }
}, { versionKey: false });

export const Notes =  mongoose.model('Notes', NotesSchema);
