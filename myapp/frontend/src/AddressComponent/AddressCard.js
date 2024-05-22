import React, { useState } from 'react';

function AddressCard({ address, onUpdate, onDelete, onViewPersons }) {
    const [isEditing, setIsEditing] = useState(false);
    const [newAddress, setNewAddress] = useState({ ...address });

    const handleUpdate = () => {
        console.log('Update button clicked');
        setIsEditing(true);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Form submitted');
        onUpdate(newAddress);
        setIsEditing(false);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewAddress(prevAddress => ({
            ...prevAddress,
            [name]: value
        }));
    };

    return (
        <div className="address-card">
            {isEditing ? (
                <form onSubmit={handleSubmit}>
                    <label>
                        Street:
                        <input type="text" name="street" value={newAddress.street} onChange={handleChange} />
                    </label>
                    <label>
                        City:
                        <input type="text" name="city" value={newAddress.city} onChange={handleChange} />
                    </label>
                    <label>
                        Zip Code:
                        <input type="text" name="zipCode" value={newAddress.zipCode} onChange={handleChange} />
                    </label>
                    <label>
                        Country:
                        <input type="text" name="country" value={newAddress.country} readOnly />
                    </label>
                    <label>
                        Random Number:
                        <input type="number" step="0.01" name="randNumber" value={newAddress.randNumber} onChange={handleChange} />
                    </label>

                    <button type="submit">Save</button>
                </form>
            ) : (
                <>
                    <strong>Street:</strong> {address.street}<br />
                    <strong>City:</strong> {address.city}<br />
                    <strong>Zip Code:</strong> {address.zipCode}<br />
                    <strong>Country:</strong> {address.country}<br />
                    <strong>Random Number:</strong> {address.randNumber}<br/>
                    <button className="update-button" onClick={handleUpdate}>Update</button>
                    <button className="delete-button" onClick={onDelete}>Delete</button>
                    <button className="view-persons-button" onClick={() => onViewPersons(address)}>View Persons</button>
                </>
            )}
        </div>
    );
}

export default AddressCard;