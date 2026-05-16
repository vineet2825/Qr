const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    fields: [{
        label: String,
        type: {
            type: String,
            enum: ['text', 'number', 'textarea', 'select', 'file'],
            default: 'text'
        },
        options: [String], // For select fields
        required: {
            type: Boolean,
            default: false
        }
    }],
    associatedItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Form', formSchema);
