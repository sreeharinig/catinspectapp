const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const upload = require('../config/multer'); // Import multer configuration
const Inspection = require('../models/Inspection');

// Route to create an inspection with images
router.post(
    '/create', 
    upload.array('images', 10),  // Allows up to 10 image uploads
    [
        body('vehicleId').notEmpty().withMessage('Vehicle ID is required'),
        body('customerId').notEmpty().withMessage('Customer ID is required'), // Validate customerId
        // Add more validation rules for tires, battery, exterior, etc., if necessary
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { vehicleId, customerId, tires, battery, exterior, brakes, engine } = req.body;

        try {
            // Create image paths based on customerId and vehicleId
            const imagePaths = req.files.map(file => `/uploads/customers/${customerId}/${vehicleId}/${file.filename}`);

            // Create new inspection
            const newInspection = new Inspection({
                vehicleId,
                tires,
                battery,
                exterior: { ...exterior, images: imagePaths },  // Attach uploaded images to exterior section
                brakes,
                engine,
                createdAt: Date.now()  // Add a timestamp to the inspection
            });

            // Save the new inspection to the database
            await newInspection.save();

            // Respond with the newly created inspection
            res.status(201).json({ success: true, inspection: newInspection });
        } catch (error) {
            console.error('Error saving inspection:', error);
            res.status(500).json({ success: false, message: 'Error saving inspection', error });
        }
    }
);

// Alternative route for creating an inspection with images (without validation middleware)
router.post('/create-alt', upload.array('images', 10), async (req, res) => {
    const { vehicleId, tires, battery, exterior, brakes, engine } = req.body;
    const customerId = req.body.customerId; // Ensure customerId is also sent

    const imagePaths = req.files.map(file => `/uploads/customers/${customerId}/${vehicleId}/${file.filename}`);

    try {
        const inspection = new Inspection({
            vehicleId,
            tires,
            battery,
            exterior: { ...exterior, images: imagePaths },  // Attach uploaded images to exterior
            brakes,
            engine,
        });
        const newInspection = await inspection.save();
        res.status(201).json({ success: true, inspection: newInspection });
    } catch (err) {
        console.error('Error saving inspection:', err);
        res.status(500).json({ success: false, message: 'Error saving inspection', error: err });
    }
});

// Get inspections for a specific vehicle
router.get('/vehicle/:vehicleId', async (req, res) => {
    try {
        const inspections = await Inspection.find({ vehicleId: req.params.vehicleId });
        res.json({ success: true, inspections });
    } catch (err) {
        console.error('Error fetching inspections:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
