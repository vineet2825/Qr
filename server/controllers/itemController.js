const Item = require('../models/Item');
const QRCode = require('qrcode');

// @desc    Create new item & generate QR
// @route   POST /api/items
// @access  Private/Admin
const createItem = async (req, res) => {
    const { 
        name, 
        modelNumber, 
        temperatureInfo, 
        coverStatus, 
        quantity, 
        description,
        imageUrl,
        documentUrl
    } = req.body;

    try {
        const item = new Item({
            name,
            modelNumber,
            temperatureInfo,
            coverStatus,
            quantity,
            availableStock: quantity > 0,
            description,
            imageUrl,
            documentUrl,
            createdBy: req.user._id
        });

        // Generate QR Code with Item ID
        // The QR code will redirect to the client's item detail page
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        const qrData = `${clientUrl}/item/${item._id}`;
        const qrCodeImage = await QRCode.toDataURL(qrData);
        
        item.qrCode = qrCodeImage;

        const createdItem = await item.save();
        res.status(201).json(createdItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all items
// @route   GET /api/items
// @access  Private
const getItems = async (req, res) => {
    try {
        const items = await Item.find({}).sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get item by ID
// @route   GET /api/items/:id
// @access  Public
const getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (item) {
            res.json(item);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private/Admin
const updateItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (item) {
            item.name = req.body.name || item.name;
            item.modelNumber = req.body.modelNumber || item.modelNumber;
            item.temperatureInfo = req.body.temperatureInfo || item.temperatureInfo;
            item.coverStatus = req.body.coverStatus || item.coverStatus;
            item.quantity = req.body.quantity !== undefined ? req.body.quantity : item.quantity;
            item.availableStock = item.quantity > 0;
            item.description = req.body.description || item.description;

            const updatedItem = await item.save();
            res.json(updatedItem);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private/Admin
const deleteItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (item) {
            await item.deleteOne();
            res.json({ message: 'Item removed' });
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createItem,
    getItems,
    getItemById,
    updateItem,
    deleteItem
};
