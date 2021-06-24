const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
    name: String,
    description: String,
    done: Boolean,
    deadline: Date,
    notes: [{ body: String }],
});

// const notesSchema = mongoose.Schema({

// });

const Todo = mongoose.model("Todo", todoSchema);

// const Note = mongoose.model("Note", notesSchema)

let store = {};

module.exports = {
    Todo,
    store
};

// TODO Schema
// name: String,
// description: String,
// done: Boolean,
// deadline: Date,