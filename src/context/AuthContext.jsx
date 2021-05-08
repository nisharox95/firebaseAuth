import React, {useState, useEffect, useContext} from 'react';
import { auth } from '../firebase';
import { db } from '../firebase';
 
const AuthContext = React.createContext({
                    currentUser: [] ,
                    isLoggedIn: false,
                    signUp:(e, p) => {return;},
                    login: (e, p)=> {return;}, 
                    loggedIn: (e) => {return;},
                    logOut: (e) => {return;},
                    update: (e) => {return;},
                    })

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {

    const [currentUser, setCurrentUser] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const loggedIn = async(id) => {
        if(id) {
            return await db.collection("user").doc(id).get()
            .then((doc) => {
                if (doc.exists) {
                    setCurrentUser(doc.data())
                    setIsLoggedIn(true);
                }
            }).catch(() => {
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
            if(currentUser.uid !== undefined) {
                setIsLoggedIn(true)
            }
            else{
                setIsLoggedIn(false)
            }
        })
    }, [currentUser.uid])
 
    
    const login = (email, password)=>{
        setIsLoggedIn(true)
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
        isLoggedIn,
    }
    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}