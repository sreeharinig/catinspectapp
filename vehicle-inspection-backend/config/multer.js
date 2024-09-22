const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Function to ensure the directory exists, creates it if not
const ensureDirectoryExistence = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true }); // Recursively create directories if they don't exist
    }
  } catch (error) {
    console.error('Error ensuring directory existence:', error);
  }
};

// Setup multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { customerId, vehicleId } = req.body;

    // Validate customerId and vehicleId to ensure they are safe and expected values
    if (customerId && vehicleId) {
      const uploadPath = path.join(__dirname, '..', 'uploads', 'customers', customerId, vehicleId);

      // Ensure directory exists
      ensureDirectoryExistence(uploadPath);

      cb(null, uploadPath); // Save the file in the created directory
    } else {
      // Fallback to a general directory if IDs are not available
      cb(null, 'uploads/');
    }
  },
  filename: (req, file, cb) => {
    // Rename the file with the current timestamp and original extension to avoid duplicates
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

// Initialize multer with the configured storage
const upload = multer({ storage });

module.exports = upload;
