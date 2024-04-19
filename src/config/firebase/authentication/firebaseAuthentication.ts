import { createUserWithEmailAndPassword as createUserWithEmailAndPasswordFirebase, Auth, GoogleAuthProvider, signInWithPopup, FacebookAuthProvider,  } from "firebase/auth";
import {  conAuth, conDatabase } from "../firebaseConfig"; 
import { doc, setDoc } from "firebase/firestore";
import { userDataTypes } from "@/config/types";
import { getDownloadURL, getStorage, ref, uploadBytes } from "@firebase/storage";

type AuthProviderTypes  = {
    authProvider: string,
}

export const createUserWithEmailAndPassword = async (userEmail: string, password: string, userFullName: string, userAccountType: string, selectedProfile: File) => {
    try {
        const userCredential = await createUserWithEmailAndPasswordFirebase(conAuth, userEmail, password);
        const { uid } = userCredential.user;

        const userData = {
            userID: uid,
            userEmail,
            userFullName,
            userAccountType,
            userAccountStatus: "Pending",
            selectedProfile,
            authProvider: "local",
        };

        // Save user data to Firestore
        const userDocPath = `users/${uid}`;
        await setDoc(doc(conDatabase, userDocPath), userData);

        // Upload profile picture to Firebase Storage
        const storage = getStorage();
        const pictureRef = ref(storage, `usersProfilePictures/${uid}/${userData.userFullName}`);
        await uploadBytes(pictureRef, selectedProfile);

        // Save profile picture URL to Firestore
        const pictureURL = await getDownloadURL(pictureRef);
        const profilePictureDocPath = `usersProfilePictures/${uid}`;
        await setDoc(doc(conDatabase, profilePictureDocPath), { pictureURL });

    } catch (error) {
        throw error;
    }
};



export const signInWithEmailAndPassword = async (auth: Auth, userEmail: string, password: string) => {
    try {
        await signInWithEmailAndPassword(auth, userEmail, password);
        console.log("User signed in successfully");
    } catch (error) {
        console.error("Error signing in:", error);
        throw error;
    }
}

export const resetPassword = async (auth: Auth, userEmail: string) => {
    try {
        sendPasswordResetEmailFirebase(auth, userEmail);
        console.log("Password reset email sent successfully");
        return userEmail;
    } catch (error) {
        console.error("Error sending password reset email:", error);
        throw error;
    }
}

function sendPasswordResetEmailFirebase(_auth: Auth, _userEmail: string) {
    throw new Error("Function not implemented.");
}

export const signInWithGoogle = async (auth: Auth) => {
    try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        console.log("User signed in with Google successfully");
    } catch (error) {
        console.error("Error signing in with Google:", error);
        throw error;
    }
}

export const signInWithFacebook = async (auth: Auth) => {
    try {
        const provider = new FacebookAuthProvider();
        await signInWithPopup(auth, provider);
        console.log("User signed in with Facebook successfully");
    } catch (error) {
        console.error("Error signing in with Facebook:", error);
        throw error;
    }
}