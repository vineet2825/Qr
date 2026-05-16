const express = require('express');
const router = express.Router();
const { createForm, getForms, getFormByItem } = require('../controllers/formController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, admin, getForms)
    .post(protect, admin, createForm);

router.get('/item/:itemId', getFormByItem);

module.exports = router;
