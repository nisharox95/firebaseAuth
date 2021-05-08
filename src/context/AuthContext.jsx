import React, {useState, useEffect, useContext} from 'react';
import { auth } from '../firebase';
import { db } from '../firebase';
 
const AuthContext = React.createContext({
                    currentUser: [] , 
                    signUp:(e, p) => {return;},
                    login: (e, p)=> {return;}, 
                    loggedIn: (e) => {return;},
                    logOut: (e) => {return;},
                    update: (e) => {return;}
                    })

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {

    const [currentUser, setCurrentUser] = useState();

    const loggedIn = async(id) => {
        if(id) {
            return await db.collection("user").doc(id).get()
            .then((doc) => {
                if (doc.exists) {
                    console.log("Document data:", doc.data());
                    setCurrentUser(doc.data())
                } else {
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        }
    }

    const update = async(id, data) => {
        if(id) {
            return await db.collection("user").doc(id).update(data)
        }
    }
    const signUp = (email, password) => {
        return auth.createUserWithEmailAndPassword(email, password)
    }
    
    useEffect(()=>{
        auth.onAuthStateChanged((user) => {
            setCurrentUser(user)
        })
    }, [])
 
    
    const login = (email, password)=>{
        return auth.signInWithEmailAndPassword(email, password)
    }

    const logOut = async() => {
        await auth.signOut()
    }

    const value = {
        currentUser,
        signUp,
        login,
        loggedIn, 
        logOut,
        update,
    }
    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}