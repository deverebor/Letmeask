import { useAuth } from '../../hooks/useAuth';
import logoutImg from '../../assets/images/sign-out.svg';
import { useHistory } from 'react-router-dom'; 

import './style.scss';

type User = {
    id: string;
    name: string;
    avatar: string;
}

type signOutProps = {
    user?: User;
}

export function SignOut(props: signOutProps) {
    const { signOut } = useAuth();
    const history = useHistory();

    function logOut() {
        signOut().then(() => history.push('/'));
    }
    
    if(props.user) {
        return (
            <button className="sign-out" onClick={logOut}>
                <img src={logoutImg} alt="Deslogar" />
            </button>
        )
    } else return <p></p>;
}