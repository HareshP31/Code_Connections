import { auth } from './firebase'; 
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { 
    createContext, 
    useContext, 
    useState, 
    useEffect 
} from 'react'; 


const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser({
                    uid: currentUser.uid,
                    email: currentUser.email,
                    username: currentUser.displayName || "User", 
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe(); 
    }, []);

    const login = (userData) => setUser(userData);
    const logout = () => setUser(null);
    // const logout = () => signOut(auth);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children} 
        </AuthContext.Provider>
    );
};
