const Cancellation = require('../models/Cancellation');

// CREATE
exports.createCancellation = async (req, res) => {
    try {
        const newCancellation = new Cancellation(req.body);
        const saved = await newCancellation.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// READ ALL
exports.getAllCancellations = async (req, res) => {
    try {
        const list = await Cancellation.find().populate('room');
        res.json(list);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// UPDATE
exports.updateCancellation = async (req, res) => {
    try {
        const updated = await Cancellation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE
exports.deleteCancellation = async (req, res) => {
    try {
        await Cancellation.findByIdAndDelete(req.params.id);
        res.json({ message: 'הביטול נמחק בהצלחה' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};