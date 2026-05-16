const express = require('express');
const router = express.Router();
const { submitForm, getSubmissions, updateSubmissionStatus } = require('../controllers/submissionController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, admin, getSubmissions)
    .post(protect, submitForm);

router.put('/:id/status', protect, admin, updateSubmissionStatus);

module.exports = router;
