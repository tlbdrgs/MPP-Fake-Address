import React, { useState, useEffect } from 'react';
import AddressCard from './AddressCard.js';
import { Bar, Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import NewAddressForm from './AddressForm.js';
import PersonTable from '../PersonTable/PersonTable.js';
import { faker } from '@faker-js/faker';
import { useNavigate, Link  } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";


function FakeAddressGenerator() {
    const [showForm, setShowForm] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [persons, setPersons] = useState([]);
    const [token, setToken] = useState(null);
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const navigate = useNavigate();
    const colors = [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
    ];

    const handleToggleForm = () => {
        setShowForm(!showForm);
    };

    const generateRandomAddress = () => {
        return {
            street: faker.address.streetName(),
        city: faker.address.city(),
        zipCode: faker.address.zipCode(),
        country: faker.address.country(),
            randNumber: Math.floor(Math.random() * 10) + 1,
        };
    };

    const floodAddresses = () => {
        const randomAddresses = Array.from({ length: 100 }, () => generateRandomAddress());
        setAddresses(randomAddresses);
    };  

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log(token);
        if (!token) {
            navigate('/fake-address-generator');
        }
    }, [navigate]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            const username = decodedToken.username;
            setUsername(username); 
        } else {
            setUsername('');
        }
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username'); // Remove username from local storage
        setToken(null);
        setUsername(''); // Reset username state
        navigate('/login');
    };


    const fetchAddresses = () => {
        const token = localStorage.getItem('token');
    
        fetch('http://localhost:3001/addresses', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Include the token in the authorization header
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            setAddresses(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleSaveAddress = (formData) => {
        const isDuplicate = addresses.some(address =>
            address.street === formData.street &&
            address.city === formData.city &&
            address.zipCode === formData.zipCode &&
            address.country === formData.country
        );
    
        if (isDuplicate) {
            console.error('The address already exists.');
            return;
        }
    
        if (/^\d{6}$/.test(formData.zipCode)) {
            const token = localStorage.getItem('token');

            fetch('http://localhost:3001/addresses', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to add address');
                    }
                    return response.json();
                })
                .then(data => {
                    setAddresses(prevAddresses => [...prevAddresses, data.newAddress]);
                    setShowForm(false);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        } else {
            console.error('Zip code should be exactly 6 numbers.');
        }
    };
    
    const handleDelete = (index) => {
        const token = localStorage.getItem('token');

    fetch(`http://localhost:3001/addresses/${index}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the authorization header
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete address');
            }
            setAddresses(prevAddresses => prevAddresses.filter((_, i) => i !== index));
            fetchAddresses();
        })
        .catch(error => {
            console.error('Error deleting address:', error);
        });
    };
    
    const handleUpdate = (index, updatedAddress) => {
        const token = localStorage.getItem('token');

    fetch(`http://localhost:3001/addresses/${index}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAddress),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update address');
            }
            fetchAddresses();
        })
        .catch(error => {
            console.error('Error updating address:', error);
        });
    };

    const handleSort = () => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:3001/addresses`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to sort addresses');
            }
            return response.json();
        })
        .then(sortedAddresses => {
            setAddresses(sortedAddresses);
            fetchAddresses();
        })
        .catch(error => {
            console.error('Error sorting addresses:', error);
        });
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleViewPersons = (address) => {
        setSelectedAddress(address);
        const token = localStorage.getItem('token');
    
        fetch(`http://localhost:3001/persons?addressId=${address.id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Include the token in the authorization header
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch persons');
                }
                return response.json(); // Parse the JSON response
            })
            .then(data => {
                console.log("Persons data:", data);
                setPersons(data); // Set persons state with the parsed JSON data
            })
            .catch(error => {
                console.error('Error fetching persons:', error);
            });
    };

    const handleAddPerson = (newPerson, addressId) => {
        const token = localStorage.getItem('token');

    fetch(`http://localhost:3001/persons?addressId=${addressId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the authorization header
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPerson),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add person');
            }
            return response.json();
        })
        .then(data => {
            setPersons(prevPersons => [...prevPersons, data.newPerson]);
        })
        .catch(error => {
            console.error('Error adding person:', error);
        });
    };

    const handleDeletePerson = (personId) => {
        const token = localStorage.getItem('token');

    fetch(`http://localhost:3001/persons/${personId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the authorization header
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete person');
            }
            return response.json();
        })
        .then(() => {
            setPersons(prevPersons => prevPersons.filter(person => person.id !== personId));
        })
        .catch(error => {
            console.error('Error deleting person:', error);
        });
    };

    const handleUpdatePerson = (personId, updatedPerson) => {
        const token = localStorage.getItem('token');

    fetch(`http://localhost:3001/persons/${personId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the authorization header
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPerson),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update person');
            }
            setPersons(prevPersons => 
                prevPersons.map(person => 
                    person.id === personId ? { ...person, ...updatedPerson } : person
                )
            );
            return response.json();
        })
        .then(data => {
            console.log('Person updated successfully:', data);
        })
        .catch(error => {
            console.error('Error updating person:', error);
        });
    };

    const filteredAddresses = addresses.filter(address =>
        address.street && address.street.toLowerCase().includes(searchQuery.toLowerCase())
    );
    

    const chartData = {
        labels: addresses.map(address => address.city),
        datasets: [
            {
                label: 'random number',
                backgroundColor: colors,
                borderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 1,
                data: addresses.map(address => address.randNumber)
            }
        ]
    };

    const pieChartData = {
        labels: addresses.map(address => address.city),
        datasets: [
            {
                label: "Random Number",
                backgroundColor: colors,
                borderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 1,
                data: addresses.map(address => address.randNumber)
            }
        ]
    };

    return (
        <div>
            <div className="App-header">
                <h1>Fake Address Generator</h1>
                {username ? (
                    <div className="user-info">
                        <p>Hello {username}</p>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </div>
            <h2 align='center'>Fake Addresses</h2>
            <div align='right' className="search-bar">
                <input
                    type="text"
                    placeholder="Search by street..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>
            <div align='center' className="sort-button">
                <button data-testid='sort-button' className="buttonOrange" onClick={handleSort}>Sort by City</button>
            </div>
            <div className="address-grid" >
                {filteredAddresses.map((address, index) => (
                    <AddressCard
                        key={index}
                        index={index}
                        address={address}
                        onUpdate={(updatedAddress) => handleUpdate(index, updatedAddress)}
                        onDelete={() => handleDelete(index)}
                        onViewPersons={() => handleViewPersons(address)}
                        onUpdatePerson={(personId, updatedPerson) => handleUpdatePerson(personId, updatedPerson)}
                    />
                ))}
            </div>
            <div>
                <div className="add-address-button-container">
                    <button className="buttonBlue" onClick={handleToggleForm}>Add Address</button>
                    <button className="buttonRed" onClick={floodAddresses}>Flood Addresses</button>
                </div>
                {showForm && <NewAddressForm onSave={handleSaveAddress} />}
            </div>
            <h2 align="center">Bar Chart: Random Numbers by City</h2>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <Bar
                    data={chartData}
                    options={{
                        maintainAspectRatio: false,
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }
                    }}
                />
            </div>
            <h2 align="center">Pie Chart: Random Numbers by City</h2>
            <div className="piechart" data-testid="pie-chart-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <Pie 
                    data={pieChartData}
                    options={{
                        maintainAspectRatio: false,
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }
                    }}
                />
            </div>
            {selectedAddress && (
                <div>
                    <h2 align="center">Persons in {selectedAddress.city} at {selectedAddress.street}</h2>
                    <PersonTable
    persons={persons}
    onAddPerson={(newPerson) => handleAddPerson(newPerson, selectedAddress.id)}
    onDeletePerson={handleDeletePerson}
    onUpdatePerson={handleUpdatePerson}
/>
                </div>
            )}
        </div>
    );
}

export default FakeAddressGenerator;
