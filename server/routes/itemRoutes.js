const express = require('express');
const router = express.Router();
const { 
    createItem, 
    getItems, 
    getItemById, 
    updateItem, 
    deleteItem 
} = require('../controllers/itemController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getItems)
    .post(protect, admin, createItem);

router.route('/:id')
    .get(getItemById)
    .put(protect, admin, updateItem)
    .delete(protect, admin, deleteItem);

module.exports = router;
