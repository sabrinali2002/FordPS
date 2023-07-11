import React, { useState } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
//import "./index.css";
import { format } from "date-fns";

const carModels = [
  { value: "Model1", label: "Model1" },
  { value: "Model2", label: "Model2" },
  { value: "Model3", label: "Model3" },
  { value: "Model4", label: "Model4" },
];

const TestDriveScheduler = () => {
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
      <div style={styles.container}>
        <div style={styles.form}>
          <h2>Appointment Confirmed</h2>
          <p>{`Name: ${customerInfo}`}</p>
          <p>{`Contact Information: ${email}`}</p>
          <p>{`Phone number: ${phone}`}</p>
          <p>{`Location: ford...`}</p>
          <p>{`Time: ${format(selectedDate, "MMMM d, h aa")}`}</p>
          <p>{`Models: ${models}`}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Schedule a Test Drive</h2>
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

        <div style={styles.selectmodels}>
          <label>Select Models:</label>
        </div>

        <div style={styles.dropdown}>
          <Select
            isMulti
            options={carModels}
            value={selectedModels}
            onChange={(models) => setSelectedModels(models)}
          />
        </div>

        <button type="submit" style={styles.button}>
          Confirm
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f8f9fa",
  },
  form: {
    width: "300px",
    background: "#fff",
    borderRadius: "15px",
    padding: "20px",
    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.15)",
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
    marginBottom: "10px",
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
  },
  inputStyle: {
    width: "500px",
  },
};

export default TestDriveScheduler;
