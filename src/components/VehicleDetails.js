import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function VehicleDetails() {
  const { customerId } = useParams(); // Retrieve customerId from route params
  const navigate = useNavigate(); // Use navigate for redirection
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        // Fetch vehicles by customerId from backend
        const response = await axios.get(`http://localhost:5001/api/vehicles/customers/${customerId}`);
        setVehicles(response.data.vehicles);
      } catch (error) {
        setError('Error fetching vehicle details');
        console.error('Error fetching vehicle details:', error);
      }
    };

    if (customerId) {
      fetchVehicleDetails(); // Call fetch only if customerId exists
    }
  }, [customerId]);

  const handleServiceClick = (vehicleId) => {
    navigate(`/inspection/${vehicleId}`); // Redirect to the inspection page
  };

  return (
    <div>
      {error && <p>{error}</p>}
      {vehicles.length > 0 ? (
        vehicles.map((vehicle) => (
          <div key={vehicle._id}>
            <h2>{vehicle.vehicleName}</h2>
            {vehicle.vehicleImage && vehicle.vehicleImage.length > 0 && (
              <div>
                <h3>Vehicle Images</h3>
                {vehicle.vehicleImage.map((image, idx) => (
                  <img
                    key={idx}
                    src={image} // Directly using the URL from the database
                    alt={`Vehicle ${idx + 1}`}
                    style={{ width: '200px', height: '150px', margin: '10px' }}
                  />
                ))}
              </div>
            )}
            <button onClick={() => handleServiceClick(vehicle._id)}>Service</button> {/* Button to go to inspection */}
          </div>
        ))
      ) : (
        <p>No vehicles found for this customer.</p>
      )}
    </div>
  );
}

export default VehicleDetails;
