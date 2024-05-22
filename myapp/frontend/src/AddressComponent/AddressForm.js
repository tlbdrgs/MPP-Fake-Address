import React, { useState } from 'react';

function NewAddressForm({ onSave }) {
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    zipCode: '',
    country: '',
    randNumber: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      street: '',
      city: '',
      zipCode: '',
      country: '',
      randNumber: ''
    });
  };

  return (
    <form className="new-address-form" onSubmit={handleSubmit}>
      <label>Street</label>
      <input type="text" name="street" value={formData.street} onChange={handleChange} placeholder="Street" required />

      <label>City</label>
      <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" required />

      <label>Zip Code</label>
      <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="Zip Code" required />

      <label>Country</label>
      <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country" required />

      <label>Random Number</label>
      <input type="number" name="randNumber" value={formData.randNumber} onChange={handleChange} placeholder="Random Number" required />

      <button type="submit">Save</button>
    </form>
  );
}

export default NewAddressForm;