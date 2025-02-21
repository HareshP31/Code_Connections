import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, loginWithGoogle } from '../services/authService';
import { useAuth } from '../AuthContext';

function Login() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await loginUser(identifier, password);
            login(user);
            navigate('/');
            window.location.reload();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const user = await loginWithGoogle();
            login(user);
            navigate('/');
            window.location.reload();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username or Email"
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                />
                <br />
                <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <br />
                <br />
                <button type="submit">Log In</button>
            </form>
            <button onClick={handleGoogleLogin} className="google-login-button" style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img 
                    src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000" 
                    alt="Google Icon" 
                    style={{ width: '20px', height: '20px' }} 
                />
                Log in with Google
            </button>

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default Login;