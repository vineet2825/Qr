const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    form: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Form',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    data: [{
        label: String,
        value: mongoose.Schema.Types.Mixed
    }],
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    adminNotes: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Submission', submissionSchema);
