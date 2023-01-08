import { createContext, useContext, useState, useEffect } from "react";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged,
	signOut,
	updateProfile,
} from "firebase/auth";
import { auth, db } from "../firebase";
import {
	setDoc,
	doc,
	getDoc,
	updateDoc,
    addDoc,
    collection,
} from "firebase/firestore";
import { useToast } from '@chakra-ui/react'

const UserContext = createContext();

const useUserContext = () => {
	return useContext(UserContext);
};

export const UserContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
	const [userEmail, setUserEmail] = useState(null);
	const [displayName, setDisplayName] = useState(null);
	const [loading, setLoading] = useState(true);
    const toast = useToast()

    const register = async (email, password, name) => {
            await createUserWithEmailAndPassword(auth, email, password);

            updateProfile(auth.currentUser, {
                displayName: name,
            });

            await reloadUser();
            const docRef = doc(db, "users", auth.currentUser.uid);

            await setDoc(docRef, {
                displayName: name,		
                email,
            });

            toast({
                title: 'Account created.',
                description: "We've created your account for you.",
                status: 'success',
                duration: 7000,
                isClosable: true,
              })
    };

    const login = async (email, password) => {
        toast({
            title: 'Logged in Successfully.',
            description: "You're logged in and ready to type!",
            status: 'success',
            duration: 7000,
            isClosable: true,
          })
		return signInWithEmailAndPassword(auth, email, password);
	};

    const logout = () => {
        toast({
            title: 'Logged out Successfully.',
            status: 'success',
            duration: 7000,
            isClosable: true,
          })
		return signOut(auth);
	};

    const reloadUser = async () => {
		await auth.currentUser.reload();
		setCurrentUser(auth.currentUser);
		setDisplayName(auth.currentUser.displayName);
		setUserEmail(auth.currentUser.email);
		return true;
	};

    const addToLeaderboard = async (name, wpm, user, time, type, acc) => {
        const reference = collection(db, 'scoreboard')

        await addDoc(reference, {
            name,
            wpm,
            user,
            time,
            type,
            acc,
        })
        return true;
    }

    useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setLoading(true);
			setCurrentUser(user);

			if (user) {
				setUserEmail(user.email);
                
			}
			setLoading(false);
		});

		return unsubscribe;
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

    const contextValues = {
		currentUser,
        displayName,
        userEmail,
		register,
		login,
		logout,
		reloadUser,
        addToLeaderboard,
	};

	return (
		<UserContext.Provider value={contextValues}>
			{loading ? (
				<div>
					Loading...
				</div>
			) : (
				children
			)}
		</UserContext.Provider>
	);
};

export { UserContextProvider as default, useUserContext };