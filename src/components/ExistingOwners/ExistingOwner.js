import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { firebase } from "../../firebase";
import Login from "./Login";
import CarSelectScreen from "./CarSelectScreen";
import { useState, useEffect } from "react";

const auth = getAuth(firebase);

function ExistingOwner({ setMessages, setMenuButtons, handleUserInput, justSelect, selectedCar, setSelectedCar, hide }) {
    const [user, loading, error] = useAuthState(auth);
    const [username, setUsername] = useState("");

    const moneyFormatter = new Intl.NumberFormat('en-US', {
        style: "currency",
        currency: "USD"
    })

    const handleResaleButton = async (car) => {
        setMessages((m) => {
            return [...m, { msg: "Car resale value", author: "You" }];
        });
        var requestOptions = {
            method: "GET",
            redirect: "follow",
        };

        let data = await fetch(`http://marketvalue.vinaudit.com/getmarketvalue.php?key=VA_DEMO_KEY&vin=${car.vin}&format=json&period=90&mileage=average`, requestOptions).then((response) => {
            return response.json();
        });
        console.log(data)
        setMessages((m) => {
            return [
                ...m,
                {
                    msg: `After looking up your car's vin number, your ${car.year} Ford ${car.model} ${car.trim} has an average resale value of ${moneyFormatter.format(data.prices.average)}. The lowest price sold in the past 90 days was ${moneyFormatter.format(data.prices.below)} and the highest was ${moneyFormatter.format(data.prices.above)}.`,
                    author: "Ford Chat",
                },
            ];
        });
    };

    useEffect(() => {
        if (hide) setMenuButtons([]);
    }, [hide]);
    return (
        <div style={{display:'flex',justifyContent:'center'}}>
            {user ? (
                <CarSelectScreen
                    user={user}
                    auth={auth}
                    username={username}
                    setMessages={setMessages}
                    setMenuButtons={setMenuButtons}
                    handleUserInput={handleUserInput}
                    justSelect={justSelect}
                    selectedCar={selectedCar}
                    setSelectedCar={setSelectedCar}
                    onResaleButton={handleResaleButton}
                />
            ) : (
                <Login username={username} setUsername={setUsername} />
            )}
        </div>
    );
}
export default ExistingOwner;
