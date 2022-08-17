const mongoose = require('mongoose');

const folderSchema = mongoose.Schema({
    /*text: {type: String, required: [true, 'Add text']},
    timestamp: { type: Date, default: Date.now },
    content: [{filename: String, created}]*/
    _id: mongoose.Schema.Types.ObjectId,
    root: {type: Boolean, required: true},
    name: {type: String, required: [true, 'name folder']},
    created: { type: Date, default: Date.now },
    content: [{
        type: String,
        name: String,
        created: { type: Date, default: Date.now },
        path: String,
        size: Number,
        length: {type: Number, required: () => {return this.type === "Video"}},
        folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', required: () => {return this.type === "Folder"}}
    }],
    parent: {type: mongoose.Schema.Types.ObjectId, ref: 'Folder', required: () => {return !this.root}}
})

module.exports = mongoose.model('Folder', folderSchema);