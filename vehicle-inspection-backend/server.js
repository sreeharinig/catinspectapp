const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
// Load environment variables from .env file
dotenv.config();
require('dotenv').config();

// Log to verify MONGO_URI is loaded correctly
console.log('MongoDB URI:', process.env.MONGO_URI);
console.log('Port:', process.env.PORT);

const app = express();
const port = process.env.PORT || 5001;
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the process if connection fails
  });

// Define routes
const inspectorRoutes = require('./routes/inspector');
const customerRoutes = require('./routes/customer');
const vehicleRoutes = require('./routes/vehicle');
const inspectionRoutes = require('./routes/inspection');

app.use('/api/inspectors', inspectorRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/inspections', inspectionRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
