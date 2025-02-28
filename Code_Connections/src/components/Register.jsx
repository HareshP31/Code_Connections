import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginWithGoogle } from '../services/authService';
import { useAuth } from '../AuthContext';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [errors, setErrors] = useState({ username: '', email: '', password: '' });
    const [success, setSuccess] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const allowedDomains = [
        'gmail', 'yahoo', 'outlook', 'aol', 
        'protonmail', 'icloud', 'ucf'
    ];

    const validateUsername = (value) => {
        if (value.length < 3) {
            setErrors((prev) => ({ ...prev, username: 'Username must be at least 3 characters.' }));
        } else {
            setErrors((prev) => ({ ...prev, username: '' }));
        }
        setUsername(value);
    };

    const validateEmail = (value) => {
        const emailParts = value.split('@');
    
        if (emailParts.length !== 2 || emailParts[0].trim() === '') {
            setErrors((prev) => ({ ...prev, email: 'Please enter a valid email.' }));
            setEmail(value);
            return;
        }
    
        const domain = emailParts[1].toLowerCase();
    
        
        if (!allowedDomains.some((d) => domain.startsWith(d))) {
            setErrors((prev) => ({ ...prev, email: 'Please enter a valid email.' }));
        } else {
            setErrors((prev) => ({ ...prev, email: '' }));
        }
    
        setEmail(value);
    };
    
    

    const validatePassword = (value) => {
        const hasLetter = /[a-zA-Z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const isValidLength = value.length >= 8;
    
        if (!hasLetter || !hasNumber || !isValidLength) {
            setErrors((prev) => ({
                ...prev,
                password: 'Password must be at least 8 characters long and contain both letters and numbers.',
            }));
        } else {
            setErrors((prev) => ({ ...prev, password: '' }));
        }
        setPassword(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (errors.username || errors.email || errors.password || !username || !email || !password) {
            return;
        }

        try {
            const user = await registerUser(email, password, username);
            setSuccess('Registration successful! Redirecting...');
            login({ ...user, username });
            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            console.error('Registration failed:', error.message);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                {/* Username Field */}
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => validateUsername(e.target.value)}
                        required
                    />
                    <div className={`error ${errors.username ? 'show' : ''}`}>{errors.username}</div>
                </div>

                {/* Email Field */}
                <div className="input-container">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => validateEmail(e.target.value)}
                        required
                    />
                    <div className={`error ${errors.email ? 'show' : ''}`}>{errors.email}</div>
                </div>

                {/* Password Field */}
                <div className="input-container">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => validatePassword(e.target.value)}
                        required
                    />
                    <div className={`error ${errors.password ? 'show' : ''}`}>{errors.password}</div>
                </div>

                {/* Submit Button */}
                <button type="submit" disabled={errors.username || errors.email || errors.password}>
                    Sign Up
                </button>
            </form>

            <button onClick={loginWithGoogle} style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img 
                    src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000" 
                    alt="Google Icon" 
                    style={{ width: '20px', height: '20px' }} 
                />
                Sign Up with Google
            </button>

            {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
    );
}

export default Register;
