import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './InspectionPage.css'; // Assuming you have the CSS file

const InspectionPage = ({ vehicleId }) => {
    const [inspectionData, setInspectionData] = useState({
        tires: {
            leftFront: '',
            rightFront: '',
            leftRear: '',
            rightRear: '',
        },
        battery: {
            make: '',
            replacementDate: '',
            voltage: '',
            waterLevel: '',
            damage: false,
            leak: false,
        },
        exterior: {
            rust: false,
            dent: false,
            damage: false,
            damageNotes: '',
            suspensionOilLeak: false,
            images: [],
        },
        brakes: {
            fluidLevel: '',
            frontCondition: '',
            rearCondition: '',
            emergencyBrakeCondition: '',
            overallSummary: '',
        },
        engine: {
            rust: false,
            dent: false,
            damage: false,
            oilCondition: '',
            oilColor: '',
            brakeFluidCondition: '',
            brakeFluidColor: '',
            oilLeak: false,
        },
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInspectionData = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/inspections/vehicle/${vehicleId}`);
                setInspectionData(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.response ? err.response.data.message : 'Error fetching inspection data.');
                setLoading(false);
            }
        };

        fetchInspectionData();
    }, [vehicleId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Update inspection data based on input type
        if (type === 'checkbox') {
            const keys = name.split('.');
            setInspectionData(prevData => {
                const updatedData = { ...prevData };
                keys.reduce((acc, key, index) => {
                    if (index === keys.length - 1) {
                        acc[key] = checked;
                    } else {
                        acc[key] = { ...acc[key] };
                    }
                    return acc[key];
                }, updatedData);
                return updatedData;
            });
        } else if (type === 'file') {
            const files = e.target.files;
            const imagesArray = Array.from(files).map(file => URL.createObjectURL(file));
            setInspectionData(prevData => ({
                ...prevData,
                exterior: {
                    ...prevData.exterior,
                    images: [...prevData.exterior.images, ...imagesArray],
                },
            }));
        } else {
            const keys = name.split('.');
            setInspectionData(prevData => {
                const updatedData = { ...prevData };
                keys.reduce((acc, key, index) => {
                    if (index === keys.length - 1) {
                        acc[key] = value;
                    } else {
                        acc[key] = { ...acc[key] };
                    }
                    return acc[key];
                }, updatedData);
                return updatedData;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send the update request
            const response = await axios.put(`http://localhost:5001/api/inspections/vehicle/${vehicleId}`, inspectionData);

            // Check if the response is successful
            if (response.status === 200) {
                alert('Inspection data updated successfully!');

                // Fetch the updated inspection data
                const updatedResponse = await axios.get(`http://localhost:5001/api/inspections/vehicle/${vehicleId}`);
                setInspectionData(updatedResponse.data); // Update the local state with the latest data
            }
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Error updating inspection data.');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <form className="inspection-page" onSubmit={handleSubmit}>
            <h1>Vehicle Inspection</h1>

            <h2>Tires</h2>
            {['leftFront', 'rightFront', 'leftRear', 'rightRear'].map(tire => (
                <div key={tire}>
                    <label>{tire}:</label>
                    <select name={`tires.${tire}`} value={inspectionData.tires[tire]} onChange={handleChange}>
                        <option value="">Select Condition</option>
                        <option value="good">Good</option>
                        <option value="ok">Okay</option>
                        <option value="needs replacement">Needs Replacement</option>
                    </select>
                </div>
            ))}

            <h2>Battery</h2>
            <div>
                <label>Make:</label>
                <select name="battery.make" value={inspectionData.battery.make} onChange={handleChange}>
                    <option value="">Select Make</option>
                    <option value="CAT">CAT</option>
                    <option value="ABC">ABC</option>
                    <option value="XYZ">XYZ</option>
                </select>
            </div>
            <div>
                <label>Replacement Date:</label>
                <input type="date" name="battery.replacementDate" value={inspectionData.battery.replacementDate} onChange={handleChange} required />
            </div>
            <div>
                <label>Voltage:</label>
                <select name="battery.voltage" value={inspectionData.battery.voltage} onChange={handleChange}>
                    <option value="">Select Voltage</option>
                    <option value="12V">12V</option>
                    <option value="13V">13V</option>
                </select>
            </div>
            <div>
                <label>Water Level:</label>
                <select name="battery.waterLevel" value={inspectionData.battery.waterLevel} onChange={handleChange}>
                    <option value="">Select Level</option>
                    <option value="Good">Good</option>
                    <option value="Ok">Okay</option>
                    <option value="Low">Low</option>
                </select>
            </div>
            <div>
                <label>Damage:</label>
                <input type="checkbox" name="battery.damage" checked={inspectionData.battery.damage} onChange={handleChange} />
            </div>
            <div>
                <label>Leak:</label>
                <input type="checkbox" name="battery.leak" checked={inspectionData.battery.leak} onChange={handleChange} />
            </div>

            <h2>Exterior</h2>
            <div>
                <label>Rust:</label>
                <input type="checkbox" name="exterior.rust" checked={inspectionData.exterior.rust} onChange={handleChange} />
            </div>
            <div>
                <label>Dent:</label>
                <input type="checkbox" name="exterior.dent" checked={inspectionData.exterior.dent} onChange={handleChange} />
            </div>
            <div>
                <label>Damage:</label>
                <input type="checkbox" name="exterior.damage" checked={inspectionData.exterior.damage} onChange={handleChange} />
            </div>
            <div>
                <label>Damage Notes:</label>
                <input type="text" name="exterior.damageNotes" value={inspectionData.exterior.damageNotes} onChange={handleChange} />
            </div>
            <div>
                <label>Suspension Oil Leak:</label>
                <input type="checkbox" name="exterior.suspensionOilLeak" checked={inspectionData.exterior.suspensionOilLeak} onChange={handleChange} />
            </div>
            <div>
                <label>Upload Images:</label>
                <input type="file" multiple onChange={handleChange} />
                <div className="image-preview">
                    {inspectionData.exterior.images.map((img, index) => (
                        <img key={index} src={img} alt="Preview" width="100" />
                    ))}
                </div>
            </div>

            <h2>Brakes</h2>
            <div>
                <label>Fluid Level:</label>
                <select name="brakes.fluidLevel" value={inspectionData.brakes.fluidLevel} onChange={handleChange}>
                    <option value="">Select Level</option>
                    <option value="good">Good</option>
                    <option value="ok">Okay</option>
                    <option value="low">Low</option>
                </select>
            </div>
            <div>
                <label>Front Condition:</label>
                <select name="brakes.frontCondition" value={inspectionData.brakes.frontCondition} onChange={handleChange}>
                    <option value="">Select Condition</option>
                    <option value="good">Good</option>
                    <option value="ok">Okay</option>
                    <option value="needs replacement">Needs Replacement</option>
                </select>
            </div>
            <div>
                <label>Rear Condition:</label>
                <select name="brakes.rearCondition" value={inspectionData.brakes.rearCondition} onChange={handleChange}>
                    <option value="">Select Condition</option>
                    <option value="good">Good</option>
                    <option value="ok">Okay</option>
                    <option value="needs replacement">Needs Replacement</option>
                </select>
            </div>
            <div>
                <label>Emergency Brake Condition:</label>
                <select name="brakes.emergencyBrakeCondition" value={inspectionData.brakes.emergencyBrakeCondition} onChange={handleChange}>
                    <option value="">Select Condition</option>
                    <option value="good">Good</option>
                    <option value="ok">Okay</option>
                    <option value="needs replacement">Needs Replacement</option>
                </select>
            </div>
            <div>
                <label>Overall Summary:</label>
                <input type="text" name="brakes.overallSummary" value={inspectionData.brakes.overallSummary} onChange={handleChange} />
            </div>

            <h2>Engine</h2>
            <div>
                <label>Rust:</label>
                <input type="checkbox" name="engine.rust" checked={inspectionData.engine.rust} onChange={handleChange} />
            </div>
            <div>
                <label>Dent:</label>
                <input type="checkbox" name="engine.dent" checked={inspectionData.engine.dent} onChange={handleChange} />
            </div>
            <div>
                <label>Damage:</label>
                <input type="checkbox" name="engine.damage" checked={inspectionData.engine.damage} onChange={handleChange} />
            </div>
            <div>
                <label>Oil Condition:</label>
                <select name="engine.oilCondition" value={inspectionData.engine.oilCondition} onChange={handleChange}>
                    <option value="">Select Condition</option>
                    <option value="good">Good</option>
                    <option value="ok">Okay</option>
                    <option value="needs replacement">Needs Replacement</option>
                </select>
            </div>
            <div>
                <label>Oil Color:</label>
                <input type="text" name="engine.oilColor" value={inspectionData.engine.oilColor} onChange={handleChange} />
            </div>
            <div>
                <label>Brake Fluid Condition:</label>
                <input type="text" name="engine.brakeFluidCondition" value={inspectionData.engine.brakeFluidCondition} onChange={handleChange} />
            </div>
            <div>
                <label>Brake Fluid Color:</label>
                <input type="text" name="engine.brakeFluidColor" value={inspectionData.engine.brakeFluidColor} onChange={handleChange} />
            </div>
            <div>
                <label>Oil Leak:</label>
                <input type="checkbox" name="engine.oilLeak" checked={inspectionData.engine.oilLeak} onChange={handleChange} />
            </div>

            <button type="submit">Submit Inspection</button>
        </form>
    );
};

export default InspectionPage;
