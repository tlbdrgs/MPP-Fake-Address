import React, { useState, useEffect } from 'react';

function UpdatePersonForm({ onUpdate, person, addressID }) {
    const [updatedPerson, setUpdatedPerson] = useState({ ...person, addressID });

    useEffect(() => {
        setUpdatedPerson({ ...person, addressID });
    }, [person, addressID]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedPerson(prevPerson => ({
            ...prevPerson,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(updatedPerson);
    };

    return (
        <form className="update-person-form" onSubmit={handleSubmit}>
            <label>Name</label>
            <input type="text" name="name" value={updatedPerson.name} onChange={handleChange} placeholder="Name" required />

            <label>Surname</label>
            <input type="text" name="surname" value={updatedPerson.surname} onChange={handleChange} placeholder="Surname" required />

            <input type="hidden" name="addressID" value={addressID} />

            <button type="submit">Submit</button>
        </form>
    );
}

export default UpdatePersonForm;