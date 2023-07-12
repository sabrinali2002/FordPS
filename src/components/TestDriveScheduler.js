import React, { useState } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import "../index.css";
import Modal from "react-modal";
import { format } from "date-fns";

const carModels = [
  { value: "Model1", label: "Bronco" },
  { value: "Model2", label: "Bronco Sport" },
  { value: "Model3", label: "E-Transit Cargo Van" },
  { value: "Model4", label: "Edge" },
  { value: "Model1", label: "Escape" },
  { value: "Model2", label: "Expediiton" },
  { value: "Model3", label: "Explorer" },
  { value: "Model4", label: "F-150" },
  { value: "Model1", label: "F-150 Lightning" },
  { value: "Model2", label: "Mustang Mach-E" },
  { value: "Model3", label: "Ranger" },
  { value: "Model4", label: "Transit Cargo Van" },
];

const TestDriveScheduler = ({ onExit, loc }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [customerInfo, setCustomerInfo] = useState("");
  const [email, setEmail] = useState("");
  const [selectedModels, setSelectedModels] = useState([]);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [models, setModels] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setModels(selectedModels.map((model) => model.value).join(", "));
    const confirmation = `Name: ${customerInfo}\nTest Drive Date: ${selectedDate}\nModels: ${models}`;

    setConfirmationMessage(confirmation);

    // Clear form
    //setSelectedDate(null);
    //setCustomerInfo("");
    //setSelectedModels([]);
  };

  if (confirmationMessage !== "") {
    return (
      //<div style={styles.container}>
      <div style={styles.form2}>
        <button
          style={styles.closeButton}
          onClick={onExit} // When clicked, invoke the `onExit` prop
        >
          <div style={{ fontSize: "15px" }}>X</div>
        </button>
        <h2>Appointment Confirmed</h2>
        <div
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingLeft: 20,
          }}
        >
          <p>{`Name: ${customerInfo}`}</p>
          <p>{`Email: ${email}`}</p>
          <p>{`Phone number: ${phone}`}</p>
          <p>{`Location: ${loc}`}</p>
          <p>{`Time: ${format(selectedDate, "MMMM d, h aa")}`}</p>
          <p style={{ paddingBottom: "30px" }}>{`Models: ${models}`}</p>
        </div>
      </div>
      //</div>
    );
  }

  return (
    //<div style={styles.container}>
    <form onSubmit={handleSubmit} style={styles.form1}>
      <button
        style={styles.closeButton}
        onClick={onExit} // When clicked, invoke the `onExit` prop
      >
        <div style={{ fontSize: "15px" }}>X</div>
      </button>

      <h2 style={{ marginBottom: "10px", marginTop: "-10px" }}>
        Schedule a Test Drive
      </h2>
      <h4
        style={{ marginBottom: "-10px", marginTop: "10px" }}
      >{`Location: ${loc}`}</h4>
      <div style={styles.selectmodels}>
        <label>Select Models:</label>
      </div>

      <div style={styles.dropdown}>
        <Select
          isMulti
          options={carModels}
          value={selectedModels}
          onChange={(models) => setSelectedModels(models)}
          wrapperClassName="myCustomDropDown"
        />
      </div>

      <div style={styles.dateContainer}></div>
      <div style={styles.infoContainer}>
        <label>Date: </label>

        <DatePicker
          wrapperClassName="myCustomDatePicker"
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={60}
          timeCaption="time"
          dateFormat="MMMM d, yyyy h:mm"
        />

        <label style={{ paddingBottom: "10px" }}>Name: </label>
        <input
          className="inputStyle"
          type="text"
          value={customerInfo}
          onChange={(e) => setCustomerInfo(e.target.value)}
        />
        <label style={{ paddingBottom: "10px" }}>Email: </label>
        <input
          className="inputStyle"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label style={{ paddingBottom: "10px" }}>Phone Number: </label>
        <input
          className="inputStyle"
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div style={styles.emailContainer}></div>

      <button type="submit" style={styles.button}>
        Confirm
      </button>
    </form>
    //</div>
  );
};

const styles = {
  form1: {
    zIndex: "1000",
    position: "absolute",
    top: "0px",
    left: "400px",
    marginTop: "0px",
    flexDirection: "column",
    display: "flex",
    width: "300px",
    height: "450px",
    justifyContent: "center",
    alignItems: "center",
    background: "#fff",
    borderRadius: "15px",
    padding: "20px",
    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.15)",
  },
  form2: {
    flexDirection: "column",
    display: "flex",
    width: "300px",
    height: "250px",
    justifyContent: "center",
    alignItems: "center",
    background: "#fff",
    borderRadius: "15px",
    padding: "20px",
    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.15)",
    paddingBottom: "20px",
  },
  dateContainer: {
    display: "flex",
    marginBottom: "10px",
    justifyContent: "space-between",
  },
  infoContainer: {
    display: "flex",
    marginBottom: "10px",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  selectmodels: {
    display: "flex",
    alignItems: "flex-start",
    marginBottom: "10px",
    alignItems: "center",
    justifyContent: "center",
  },
  dropdown: {
    marginTop: "0px",
    marginBottom: "0px",
  },
  button: {
    marginTop: "10px",
    padding: "10px",
    color: "#fff",
    background: "#007bff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "opacity 0.3s ease",
    textAlign: "center",
    width: "300px",
    marginBottom: "20px",
  },
  inputStyle: {
    width: "500px",
  },
  closeButton: {
    position: "relative", // Position the button absolutely...
    top: "0px", // ...20px from the top...
    right: "-140px", // ...and 20px from the right of its nearest positioned ancestor (in this case, the container div)
    // Add some more styling to make it look like a close button
    background: "#ccc",
    color: "white",
    border: "none",
    borderRadius: "50%", // Make it circular
    width: "25px",
    height: "25px",
    textAlign: "center",
    lineHeight: "25px", // Vertically center the "X"
    cursor: "pointer",
  },
};

export default TestDriveScheduler;
