import "./sched.css";
import Sched1 from "./sched1";
import Sched2 from "./sched2";
import Sched3 from "./sched3";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { firebase } from "../../firebase";
import { getAuth } from "firebase/auth";

const auth = getAuth(firebase);

function SchedDisp({ dealer, phone, setPhone, address, setAddress, link, setLink, hours, setHours, maintenanceMode="", model="", trim="", backButton, setMenuButtons, setMessages, origButtons,setSchedSent, changeChoice, setQuery }) {
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
  };
  const [appointmentDetails, setAppointmentDetails] = useState({});

  const handleAppointment = (name, email, phoneNumber, notes, phone, address, link, hours) => {
    setSchedSent(true);
    setName(name);
    setEmail(email);
    setPhoneNumber(phoneNumber);
    setNotes(notes);
    setAppointmentDetails({ name, email, phoneNumber, notes });
    setVis2(false);
    setVis3(true);
    setPhone(phone);
    setAddress(address);
    setLink(link);
    setHours(hours);
    changeChoice("");
    setQuery("")
    setMessages((m) => {
      return [
        ...m,
        { msg: "Is there anything else I can help you with?", author: "Ford Chat" },
      ];
    });
    setMenuButtons(origButtons);
    return;
  };
  return ( 
    <div className="App">
      {vis1 && <Sched2 callback={handleCallback} maintenanceMode={maintenanceMode} backButton={backButton} />}
      {vis2 && (
        <Sched1
          dealer={dealer}
          date={date}
          time={hour}
          handleAppointment={handleAppointment}
          maintenanceMode={maintenanceMode}
          model={model}
          trim={trim}
          backButton={backButton}
          dispName={user === null ? '' : user.displayName} 
          userEmail={user === null ? '' : user.email}
          phoneNum={phone}
          link={link}
          address={address}
          hours={hours}
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
