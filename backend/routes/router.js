const express = require('express');
const router = express.Router();
const FakeAddressRepository = require('../repository/repository');
const PersonRepository = require('../repository/personRepository');
const UserRepository = require('../repository/userRepository');
const jwt = require('jsonwebtoken');

const addressRepository = new FakeAddressRepository();
const personRepository = new PersonRepository();
const userRepository = new UserRepository();

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);

        req.user = user;
        next();
    });
};

router.route('/addresses')
    .get(authenticateToken, async (req, res) => {
        try {
            const addresses = await addressRepository.getAll();
            res.json(addresses);
        } catch (error) {
            console.error('Error fetching addresses:', error);
            res.status(500).json({ message: 'Error fetching addresses' });
        }
    })
    .put(authenticateToken, async (req, res) => {
        try {
            addressRepository.sortAddressesByCity();
            const sortedAddresses = await addressRepository.getAll();
            res.json(sortedAddresses);
        } catch (error) {
            console.error('Error sorting addresses:', error);
            res.status(500).json({ message: 'Error sorting addresses' });
        }
    })
    .post(authenticateToken, async (req, res) => {
        const newAddress = req.body;
        try {
            const addedAddress = await addressRepository.add(newAddress);
            res.json({ message: 'Address added successfully', newAddress: addedAddress });
        } catch (error) {
            console.error('Error adding address:', error);
            res.status(500).json({ message: 'Error adding address' });
        }
    });

router.put('/addresses/:index', authenticateToken, async (req, res) => {
    const index = parseInt(req.params.index);
    const updatedAddress = req.body;
    try {
        const updatedAddressData = await addressRepository.update(index, updatedAddress);
        res.json({ message: 'Address updated successfully', updatedAddress: updatedAddressData });
    } catch (error) {
        console.error('Error updating address:', error);
        res.status(500).json({ message: 'Error updating address' });
    }
});

router.delete('/addresses/:index', authenticateToken, async (req, res) => {
    const index = parseInt(req.params.index);
    try {
        await addressRepository.delete(index);
        res.json({ message: 'Address deleted successfully' });
    } catch (error) {
        console.error('Error deleting address:', error);
        res.status(500).json({ message: 'Error deleting address' });
    }
});

router.route('/persons')
    .get(authenticateToken, async (req, res) => {
        const addressId = parseInt(req.query.addressId);
        try {
            const persons = await personRepository.getPersonsByAddress(addressId);
            res.json(persons);
        } catch (error) {
            console.error('Error fetching persons:', error);
            res.status(500).json({ message: 'Error fetching persons' });
        }
    })
    .post(authenticateToken, async (req, res) => {
        const newPerson = req.body;
        try {
            const addedPerson = await personRepository.add(newPerson);
            res.json({ message: 'Person added successfully', newPerson: addedPerson });
        } catch (error) {
            console.error('Error adding person:', error);
            res.status(500).json({ message: 'Error adding person', error: error.message });
        }
    })
    .delete(authenticateToken, async (req, res) => {
        const personId = parseInt(req.query.personId);
        try {
            await personRepository.delete(personId);
            res.json({ message: 'Person deleted successfully' });
        } catch (error) {
            console.error('Error deleting person:', error);
            res.status(500).json({ message: 'Error deleting person' });
        }
    });

router.put('/persons/:personId', authenticateToken, async (req, res) => {
    const personId = parseInt(req.params.personId);
    const updatedPerson = req.body;
    try {
        const updatedPersonData = await personRepository.update(personId, updatedPerson);
        res.json({ message: 'Person updated successfully', updatedPerson: updatedPersonData });
    } catch (error) {
        console.error('Error updating person:', error);
        res.status(500).json({ message: 'Error updating person' });
    }
});

router.delete('/persons/:personId', authenticateToken, async (req, res) => {
    const personId = parseInt(req.params.personId);
    try {
        await personRepository.delete(personId);
        res.json({ message: 'Person deleted successfully' });
    } catch (error) {
        console.error('Error deleting person:', error);
        res.status(500).json({ message: 'Error deleting person' });
    }
});

router.route('/users')
    .get(authenticateToken, async (req, res) => {
        try {
            const users = await userRepository.getAll();
            console.log('Retrieved users:', users);
            res.json(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ message: 'Error fetching users' });
        }
    })
    .post(authenticateToken, async (req, res) => {
        const newUser = req.body;
        try {
            const message = await userRepository.addUser(newUser);
            console.log(message);
            res.json({ message: 'User added successfully' });
        } catch (error) {
            console.error('Error adding user:', error);
            res.status(500).json({ message: 'Error adding user' });
        }
    });

    router.post('/login', async (req, res) => {
        const { username, password } = req.body;
    
        try {
            const users = await userRepository.getAll();
            const user = users.find(user => user.username === username && user.password === password);
    
            if (!user) {
                return res.status(401).json({ message: 'Incorrect username or password' });
            }
    
            const token = jwt.sign({ username, userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            console.log(`Generated token for user ${username}: ${token}`);
            res.json({ message: 'Login successful', token });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please provide username, email, and password' });
    }

    try {
        await userRepository.addUser({ username, email, password });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
