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
    const DEFAULT_PROFILE_PICTURE = 'https://cdn.pfps.gg/pfps/2301-default-2.png';

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: username });

        // ✅ Add user to Firestore with `numberOfPosts: 0`
        await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            username: username,
            email: email,
            profilePicture: DEFAULT_PROFILE_PICTURE,
            bio: '',
            numberOfPosts: 0, // ✅ Initialize numberOfPosts
            lastSeen: new Date() // ✅ Set last seen to the current time
        });

        return {
            uid: user.uid,
            email: user.email,
            username: username,
            profilePicture: DEFAULT_PROFILE_PICTURE,
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
            const profilePicture = user.photoURL || 'https://cdn.pfps.gg/pfps/2301-default-2.png';

            // ✅ New users signing in with Google also get `numberOfPosts: 0`
            await setDoc(userDocRef, {
                uid: user.uid,
                username: displayName,
                email: user.email,
                profilePicture: profilePicture,
                bio: '',
                numberOfPosts: 0, // ✅ Initialize numberOfPosts for Google users
                lastSeen: new Date()
            });
        }

        return {
            uid: user.uid,
            email: user.email,
            username: user.displayName,
            profilePicture: user.photoURL, 
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
                throw new Error('auth/user-not-found');
            }
        }

        console.log("Attempting login with email:", email);
        await setPersistence(auth, browserSessionPersistence);

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log("User logged in:", user.uid);

        return {
            uid: user.uid,
            email: user.email,
            username: user.displayName,
        };
    } catch (error) {
        console.error("Login error:", error.code || error.message);
        throw new Error(error.code ? error.code : error.message);
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