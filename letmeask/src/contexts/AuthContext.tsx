//Criação da autenticação do usuário para login no site.
import { createContext, ReactNode, useEffect, useState } from "react"
import { auth, firebase } from "../services/firebase"

//Criação das tipagens utilizadas. 
type User = {
    id: string;
    name: string;
    avatar: string;
  }
  
  type AuthContextType = {
    user: User | undefined; //No primeiro momento não existe usuário logado então é undefined.
    signInWithGoogle: () => Promise<void>
  }
  
  type AuthContextProviderProps = {
      children: ReactNode;
  }
  

export const AuthContext = createContext({} as AuthContextType)//Aqui se passa o formato da informação que vai armazenar dentro do contexto, nesse caso um objeto

export function AuthContextProvider(props: AuthContextProviderProps){
    const [user, setUser] = useState<User>()

  useEffect(() => {
    //Event listen. Se for detectado que um usuário já foi logado na aplicação vai ser retornado o usuário.
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
          const { displayName, photoURL, uid } = user
  
          if (!displayName || !photoURL) {
            throw new Error('Missing Information from Google Account.')
          }
  
          setUser({
            id: uid, 
            name: displayName,
            avatar: photoURL
          })
      }
    })

    return () => {
      unsubscribe()
    }
  }, [] )

  //Função para login com a conta do google na aplicação
  async function signInWithGoogle() {
    //Autenticação do usuário
    const provider = new firebase.auth.GoogleAuthProvider()

    const result = await auth.signInWithPopup(provider)

      if (result.user) {
        const { displayName, photoURL, uid } = result.user

        if (!displayName || !photoURL) {
          throw new Error('Missing Information from Google Account.')
        }

        setUser({
          id: uid, 
          name: displayName,
          avatar: photoURL
        })
      }


  }
    return(
        <AuthContext.Provider value={{ user, signInWithGoogle }}>
            {props.children}
        </AuthContext.Provider>
    )
}