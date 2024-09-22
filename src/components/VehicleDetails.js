import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function VehicleDetails() {
  const { customerId } = useParams(); // Retrieve customerId from route params
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch vehicle details including images
    const fetchVehicleDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/vehicles`, {
          params: { customerId } // Send customerId as a query parameter
        });
        setVehicles(response.data.vehicles);
      } catch (error) {
        setError('Error fetching vehicle details');
        console.error('Error fetching vehicle details:', error);
      }
    };

    fetchVehicleDetails();
  }, [customerId]);

  return (
    <div>
      {error && <p>{error}</p>}
      {vehicles.length > 0 ? (
        vehicles.map((vehicle, index) => (
          <div key={index}>
            <h2>{vehicle.vehicleName}</h2>
            <p>License Plate: {vehicle.licensePlate}</p>
            <p>Status: {vehicle.status}</p>
            {vehicle.vehicleImage && vehicle.vehicleImage.length > 0 && (
              <div>
                <h3>Vehicle Images</h3>
                {vehicle.vehicleImage.map((image, idx) => (
                  <img 
                    key={idx} 
                    src={`/uploads/customers/${customerId}/${vehicle._id}/${image}`} 
                    alt={`Vehicle ${idx + 1}`} 
                    style={{ width: '200px', height: '150px', margin: '10px' }}
                  />
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No vehicles found for this customer.</p>
      )}
    </div>
  );
}

export default VehicleDetails;
