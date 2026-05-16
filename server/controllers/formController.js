const Form = require('../models/Form');

// @desc    Create a new dynamic form
// @route   POST /api/forms
// @access  Private/Admin
const createForm = async (req, res) => {
    try {
        const { title, description, fields, associatedItem } = req.body;
        
        const form = new Form({
            title,
            description,
            fields,
            associatedItem,
            createdBy: req.user._id
        });

        const createdForm = await form.save();
        res.status(201).json(createdForm);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all forms
// @route   GET /api/forms
// @access  Private/Admin
const getForms = async (req, res) => {
    try {
        const forms = await Form.find({}).populate('associatedItem', 'name modelNumber');
        res.json(forms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get form by Item ID
// @route   GET /api/forms/item/:itemId
// @access  Public
const getFormByItem = async (req, res) => {
    try {
        const form = await Form.findOne({ associatedItem: req.params.itemId });
        if (form) {
            res.json(form);
        } else {
            res.status(404).json({ message: 'No form found for this item' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createForm,
    getForms,
    getFormByItem
};
