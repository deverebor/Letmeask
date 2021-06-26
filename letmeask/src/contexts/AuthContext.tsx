import { createContext, ReactNode, useEffect, useState } from "react";
import { auth, firebase } from "../services/firebase";

import toast from 'react-hot-toast';

type User = {
    id: string;
    name: string;
    avatar: string;
  }
  
  type AuthContextType = {
    user: User | undefined;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
  }

type AuthContextProviderProps = {
    children: ReactNode
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
    const [user, setUser] = useState<User>();

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(user => {
        if(user) {
          const { displayName, photoURL, uid } = user;
  
          if(!displayName || !photoURL) {
            toast.error('Faltam informações na sua conta Google.');
            return;
          }
  
          setUser({
            id: uid,
            name: displayName,
            avatar: photoURL
          });
        }
      });
  
      return () => {
        unsubscribe();
      }
    }, []);
    
    async function signInWithGoogle() {
      const provider = new firebase.auth.GoogleAuthProvider();
  
      const result = await auth.signInWithPopup(provider);
  
      if(result.user) {
        const { displayName, photoURL, uid } = result.user;
  
        if(!displayName || !photoURL) {
          toast.error('Faltam informações na sua conta Google.');
          return;
        }
  
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        });
      }
          
    }

    async function signOut() {
      await auth.signOut();
      
      setUser(undefined);

      //history.pushState()
    }

    return (
        <AuthContext.Provider value={{ user, signInWithGoogle, signOut }}>
            {props.children}
        </AuthContext.Provider>
    )
}