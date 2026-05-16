const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    modelNumber: {
        type: String,
        required: true
    },
    temperatureInfo: String,
    coverStatus: String,
    availableStock: {
        type: Boolean,
        default: true
    },
    quantity: {
        type: Number,
        default: 0
    },
    description: String,
    imageUrl: String,
    documentUrl: String,
    qrCode: {
        type: String // Base64 or URL to image
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Item', itemSchema);
