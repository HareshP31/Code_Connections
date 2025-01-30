import { auth } from '../firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from 'firebase/auth';

export const registerUser = async (email, password, username) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: username });

        return {
            uid: user.uid,
            email: user.email,
            username: user.displayName,
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

export const loginUser = async (email, password) => {
    try {
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
    } catch (error) {
        throw new Error(error.message);
    }
};
