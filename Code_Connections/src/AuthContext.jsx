import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

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

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    const userRef = doc(db, 'users', currentUser.uid);
                    const userDoc = await getDoc(userRef);

                    let userData = {
                        uid: currentUser.uid,
                        email: currentUser.email,
                        username: currentUser.displayName || 'User',
                        profilePicture: currentUser.photoURL || 'https://cdn.pfps.gg/pfps/2301-default-2.png',
                    };

                    if (userDoc.exists()) {
                        userData = { ...userData, ...userDoc.data() };
                    }

                    setUser(userData);

                    // ✅ Update lastSeen timestamp in Firestore
                    await updateDoc(userRef, {
                        lastSeen: serverTimestamp(),
                    });

                    console.log(`✅ Last seen updated for ${currentUser.uid}`);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

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
