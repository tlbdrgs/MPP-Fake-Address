import React, { useState } from 'react';
import UpdatePersonForm from './PersonForm.js';

function PersonTable({ persons, onAddPerson, onDeletePerson, onUpdatePerson }) {
    const [newPerson, setNewPerson] = useState({ name: '', surname: '', addressID: '' });
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState(null);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewPerson(prevPerson => ({
            ...prevPerson,
            [name]: value
        }));
    };

    const handleAdd = () => {
        onAddPerson(newPerson);
        setNewPerson({ name: '', surname: '', addressID: '' });
    };

    const handleUpdate = (personId) => {
        const person = persons.find(person => person.id === personId);
        if (person) {
            setSelectedPerson(person);
            setShowUpdateForm(true);
        }
    };

    return (
        <div className="person-table-container">
            <h2>Persons</h2>
            <table className="person-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>Actions</th>
                    </tr>
                </thead>    
                <tbody>
                    {Array.isArray(persons) && persons.map(person => (
                        <tr key={person.id}>
                            <td>{person.name}</td>
                            <td>{person.surname}</td>
                            <td>
                                <button onClick={() => onDeletePerson(person.id)}>Delete</button>
                                <button onClick={() => handleUpdate(person.id)}>Update</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showUpdateForm && (
                <UpdatePersonForm
                    onUpdate={(updatedPerson) => {
                        onUpdatePerson(selectedPerson.id, updatedPerson);
                        setShowUpdateForm(false);
                    }}
                    person={selectedPerson}
                />
            )}
            <div className="add-person-form"> {/* Apply form styling */}
                <h3>Add New Person</h3>
                <input type="text" name="name" value={newPerson.name} onChange={handleChange} placeholder="Name" required />
                <input type="text" name="surname" value={newPerson.surname} onChange={handleChange} placeholder="Surname" required />
                <input type="text" name="addressID" value={newPerson.addressID} onChange={handleChange} placeholder="Address ID" required />
                <button onClick={handleAdd}>Add</button>
            </div>
        </div>
    );
}

export default PersonTable;
