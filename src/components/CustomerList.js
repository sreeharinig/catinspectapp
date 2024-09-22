// src/components/CustomerList.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CustomerList.css'; // Import the CSS file

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch customers from your API
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/customers');
        setCustomers(response.data.customers);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  // Redirect to the vehicle details page when the "Select" button is clicked
  const handleSelectCustomer = (customerId) => {
    navigate(`/vehicles/${customerId}`);
  };

  return (
    <div className="customer-list">
      {customers.map((customer) => (
        <div className="customer-card" key={customer._id}>
          <h3>{customer.name}</h3>
          <p>Email: {customer.email}</p>
          <button onClick={() => handleSelectCustomer(customer._id)}>
            Select
          </button>
        </div>
      ))}
    </div>
  );
}

export default CustomerList;
