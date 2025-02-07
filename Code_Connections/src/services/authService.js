import { auth, db } from '../firebase';
import {
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    setPersistence,
    browserSessionPersistence,
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

export const initializeAuthPersistence = async () => {
    try {
        await setPersistence(auth, browserSessionPersistence);
        console.log('Firebase auth persistence set to session.');
    } catch (error) {
        console.error('Error setting Firebase persistence:', error);
    }
};

export const registerUser = async (email, password, username) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: username });

        await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            username: username,
            email: email,
        });

        return {
            uid: user.uid,
            email: user.email,
            username: user.displayName,
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

export const loginWithGoogle = async () => {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            const displayName = user.displayName || 'Google_User';
            await setDoc(userDocRef, {
                uid: user.uid,
                username: displayName,
                email: user.email,
            });
        }

        return {
            uid: user.uid,
            email: user.email,
            username: user.displayName,
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

export const loginUser = async (identifier, password) => {
    try {
        let email = identifier;

        if (!identifier.includes('@')) {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('username', '==', identifier));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                email = querySnapshot.docs[0].data().email;
            } else {
                throw new Error('No account found with that username.');
            }
        }

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        return {
            uid: user.uid,
            email: user.email,
            username: user.displayName,
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

export const logoutUser = async () => {
    try {
        await signOut(auth);
        await setPersistence(auth, browserSessionPersistence);
        console.log('User logged out and session cleared.');
    } catch (error) {
        console.error('Error during logout:', error);
        throw new Error(error.message);
    }
};