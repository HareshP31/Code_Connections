import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginWithGoogle } from '../services/authService';
import { useAuth } from '../AuthContext';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await registerUser(email, password, username);
            setSuccess('Registration successful! Redirecting to the homepage...');
            login({ ...user, username });
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleGoogleRegister = async () => {
        try {
            const user = await loginWithGoogle();
            login(user);
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <br />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <br />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br />
                <br />
                <button type="submit">Sign Up</button>
            </form>
            <button onClick={handleGoogleRegister} style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img 
                    src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000" 
                    alt="Google Icon" 
                    style={{ width: '20px', height: '20px' }} 
                />
                Sign Up with Google
            </button>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
    );
}

export default Register;