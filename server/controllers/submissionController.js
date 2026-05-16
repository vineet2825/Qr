const Submission = require('../models/Submission');

// @desc    Submit form data
// @route   POST /api/submissions
// @access  Private
const submitForm = async (req, res) => {
    try {
        const { form, data } = req.body;

        const submission = new Submission({
            form,
            user: req.user._id,
            data
        });

        const createdSubmission = await submission.save();
        res.status(201).json(createdSubmission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all submissions
// @route   GET /api/submissions
// @access  Private/Admin
const getSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({})
            .populate('form', 'title')
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update submission status
// @route   PUT /api/submissions/:id
// @access  Private/Admin
const updateSubmissionStatus = async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id);

        if (submission) {
            submission.status = req.body.status || submission.status;
            submission.adminNotes = req.body.adminNotes || submission.adminNotes;

            const updatedSubmission = await submission.save();
            res.json(updatedSubmission);
        } else {
            res.status(404).json({ message: 'Submission not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    submitForm,
    getSubmissions,
    updateSubmissionStatus
};
