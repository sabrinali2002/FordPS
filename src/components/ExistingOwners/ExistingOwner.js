import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import {firebase} from '../../firebase'
import Login from './Login';
import CarSelectScreen from './CarSelectScreen';
import { useState, useEffect } from 'react';

const auth = getAuth(firebase);

function ExistingOwner({setMessages, setMenuButtons, handleUserInput, justSelect, selectedCar, setSelectedCar, hide}){
    const [user, loading, error] = useAuthState(auth);
    const [username, setUsername] = useState("")
    useEffect(() => {
        if(hide)
            setMenuButtons([])
    }, [hide])
    return (
        <div>
            {
             user ? <CarSelectScreen user={user} auth={auth} username={username} setMessages={setMessages} setMenuButtons={setMenuButtons} handleUserInput={handleUserInput} justSelect={justSelect} selectedCar={selectedCar}
             setSelectedCar={setSelectedCar}/>:<Login username={username} setUsername={setUsername}/>
            }
        </div>
    )
}
export default ExistingOwner;