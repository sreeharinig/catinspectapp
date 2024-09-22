const express = require('express');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const router = express.Router();
const upload = require('../config/multer'); // Import multer configuration
const Vehicle = require('../models/Vehicle');

// Get all vehicles (without customerId filter)
router.get('/', async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.json({ success: true, vehicles });
    } catch (err) {
        console.error('Error fetching vehicles:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Create a new vehicle with validation and image upload
router.post(
    '/',
    upload.array('vehicleImage', 10), // Upload up to 10 images
    [
        body('customerId').notEmpty().withMessage('Customer ID is required'),
        body('vehicleName').notEmpty().withMessage('Vehicle name is required'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { customerId, vehicleName } = req.body;
        const fileNames = req.files ? req.files.map(file => file.filename) : []; // Store file names of uploaded images

        try {
            // Create a new vehicle associated with the customer, ensuring customerId is treated as ObjectId
            const vehicle = new Vehicle({
                customerId: mongoose.Types.ObjectId(customerId), // Ensure customerId is ObjectId
                vehicleName,
                vehicleImage: fileNames, // Save uploaded image file names in vehicle document
            });

            const newVehicle = await vehicle.save();
            res.status(201).json({ success: true, vehicle: newVehicle });
        } catch (err) {
            console.error('Error saving vehicle:', err);
            res.status(400).json({ success: false, message: 'Error saving vehicle' });
        }
    }
);

// Upload additional images for an existing vehicle
router.post('/upload', upload.array('vehicleImage', 10), async (req, res) => {
    try {
        const { vehicleId } = req.body; // Retrieve vehicleId from the request body
        const fileNames = req.files.map(file => file.filename); // Get uploaded file names

        // Find the vehicle by ID
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ success: false, message: 'Vehicle not found' });
        }

        // Add new image paths to the existing vehicle document
        vehicle.vehicleImage = vehicle.vehicleImage.concat(fileNames); // Append new image names to existing ones
        await vehicle.save();

        res.status(200).json({ success: true, message: 'Images uploaded successfully', fileNames });
    } catch (error) {
        console.error('Error uploading images:', error);
        res.status(500).json({ success: false, message: 'Error uploading images', error });
    }
});

// Get vehicles by customerId
router.get('/vehicles/:customerId', async (req, res) => {
    try {
        const { customerId } = req.params;

        // Validate that customerId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(customerId)) {
            return res.status(400).json({ success: false, message: 'Invalid customerId format' });
        }

        const customerObjectId = mongoose.Types.ObjectId(customerId); // Convert to ObjectId

        // Log the converted ObjectId to verify
        console.log('Converted ObjectId:', customerObjectId);

        // Fetch vehicles by customerId
        const vehicles = await Vehicle.find({ customerId: customerObjectId });

        if (!vehicles || vehicles.length === 0) {
            return res.status(404).json({ success: false, message: 'No vehicles found for this customer' });
        }

        res.json({ success: true, vehicles });
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Export the router
module.exports = router;
