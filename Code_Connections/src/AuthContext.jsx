import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut, setPersistence, browserSessionPersistence } from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializePersistence = async () => {
            try {
                await setPersistence(auth, browserSessionPersistence);
            } catch (error) {
                console.error('Error setting Firebase persistence:', error);
            }
        };
        initializePersistence();

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser({
                    uid: currentUser.uid,
                    email: currentUser.email,
                    username: currentUser.displayName || 'User',
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = (userData) => setUser(userData);

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
