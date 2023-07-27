import "./sched.css";
import Sched1 from "./sched1";
import Sched2 from "./sched2";
import Sched3 from "./sched3";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { firebase } from "../../firebase";
import { getAuth } from "firebase/auth";

const auth = getAuth(firebase);

function SchedDisp({ dealer, phone, address, link, hours, maintenanceMode="", model="", trim="", backButton }) {
  const [hour, setHour] = useState(null);
  const [date, setDate] = useState(null);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [notes, setNotes] = useState(null);
  const [vis1, setVis1] = useState(true);
  const [vis2, setVis2] = useState(false);
  const [vis3, setVis3] = useState(false);
  const [user, loading, error] = useAuthState(auth);

  const handleCallback = (hr, dt) => {
    setHour(hr);
    setDate(dt);
    setVis1(false);
    setVis2(true);
    console.log("a" + hr, dt + "a");
  };
  const [appointmentDetails, setAppointmentDetails] = useState({});

  const handleAppointment = (name, email, phoneNumber, notes) => {
    setName(name);
    setEmail(email);
    setPhoneNumber(phoneNumber);
    setNotes(notes);
    setAppointmentDetails({ name, email, phoneNumber, notes });
    console.log(name, email, phoneNumber, notes);
    setVis2(false);
    setVis3(true);
  };
  console.log("APPT TIME"+model, trim)
  return ( 
    <div className="App">
      {vis1 && <Sched2 callback={handleCallback} maintenanceMode={maintenanceMode} backButton={backButton} />}
      {vis2 && (
        <Sched1
          dealer={dealer}
          handleAppointment={handleAppointment}
          date={date}
          time={hour}
          maintenanceMode={maintenanceMode}
          model={model}
          trim={trim}
          backButton={backButton}
          dispName={user === null ? '' : user.displayName} 
          userEmail={user === null ? '' : user.email}
        />
      )}
      {vis3 && (
        <Sched3
          dealer={dealer}
          date={date}
          time={hour}
          name={name}
          email={email}
          phoneNumber={phoneNumber}
          notes={notes}
          phone={phone}
          address={address}
          link={link}
          hours={hours}
          maintenanceMode={maintenanceMode}
          model={model}
          trim={trim}
        />
      )}
    </div>
  );
}

export default SchedDisp;
