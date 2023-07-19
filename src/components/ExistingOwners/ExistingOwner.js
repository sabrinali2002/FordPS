import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import {firebase} from '../../firebase'
import Login from './Login';
import CarSelectScreen from './CarSelectScreen';
import { useState, useEffect } from 'react';

const auth = getAuth(firebase);

function ExistingOwner({setMessages, setMenuButtons, handleUserInput}){
    const [user, loading, error] = useAuthState(auth);
    const [username, setUsername] = useState("")
    useEffect(() => {
        setMenuButtons([])
    }, [])
    return (
        <div>
            {
             user ? <CarSelectScreen user={user} auth={auth} username={username} setMessages={setMessages} setMenuButtons={setMenuButtons} handleUserInput={handleUserInput}/>:<Login username={username} setUsername={setUsername}/>
            }
        </div>
    )
}
export default ExistingOwner;