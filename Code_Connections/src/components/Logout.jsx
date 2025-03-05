import { logoutUser } from '../services/authService';

function Logout() {
    const handleLogout = async () => {
        await logoutUser();
        alert('Logged out successfully');
    };

    return <button onClick={handleLogout}>Logout</button>;
}

export default Logout;