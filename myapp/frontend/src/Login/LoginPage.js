    import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { jwtDecode } from 'jwt-decode'; // Corrected import statement

    const LoginPage = () => {
        const [username, setUsername] = useState('');
        const [password, setPassword] = useState('');
        const [errorMessage, setErrorMessage] = useState('');
        const navigate = useNavigate();

        const handleLogin = async (e) => {
            e.preventDefault();

            try {
                const response = await fetch('http://localhost:3001/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                if (!response.ok) {
                    console.error('Response status:', response.status);
                    throw new Error('Login failed');
                }

                const data = await response.json();

                if (data && data.token) {
                    const decodedToken = jwtDecode(data.token);
                    const usernameFromToken = decodedToken.username; // Extract username from token
                    localStorage.setItem('username', usernameFromToken); // Set username to local storage
                    localStorage.setItem('token', data.token); // Set token to local storage
                    navigate('/fake-address-generator');
                } else {
                    setErrorMessage(data.message || 'Login failed');
                }
            } catch (error) {
                console.error('Login error:', error);
                setErrorMessage('Login failed');
            }
        };


        return (
            <div>
                <h2>Login</h2>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <form onSubmit={handleLogin}>
                    <div>
                        <label>Username:</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit">Login</button>
                </form>
                <button onClick={() => navigate('/register')}>Register</button>
            </div>
        );
    };

    export default LoginPage;
