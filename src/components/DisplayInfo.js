import data from '../images/image_link.json'
import dealerships from "../jsons/trimToDealer.json"

export default function DisplayInfo({ info }) {
  return (
    <div
      style={{
        height: "400px",
        width: "900px", // Increase width to desired value
        display: "flex",
        float: "left",
        borderRadius: "15px", // Add this for rounded corners
        backgroundColor: "#d4e3fa",
        flexDirection: "column",
        margin: "10px"
      }}
    >
      <div>
        <div style={{ padding: "10px" }}>
          <div
            style={{
              float: "right",
              width: "356px",
              height: "180px",
              margin: "20px",
              backgroundColor: "white",
              borderRadius: "15px",
              boxShadow: "0 4px 2px -2px gray"
            }}
          >
            <img src={data[info.model]} alt={info.model}></img>
          </div>
          <div style={{ marginLeft: "20px", marginTop: "10px" }}>
            <h2>
              {"2023 "}
              <strong>{info.model}</strong> &#x24C7;{" "}
              <strong>{info.trim + " "}</strong>&#x24C7; model
            </h2>
            <div style={{ marginBottom: "25px" }}>
              <h3 style={{ fontSize: "20px" }}>
                <strong>Estimated net price</strong> $36,630
                <button
                  style={{
                    marginLeft: "10px",
                    background: "none",
                    border: "none",
                    color: "blue",
                    textDecoration: "underline",
                    cursor: "pointer"
                  }}
                >
                  ...more
                </button>
              </h3>
              <h3 style={{ fontSize: "20px" }}>
                <strong>Available at</strong>{" "}
                {" " +
                  dealerships[info.model][info.trim][0] +
                  ", " +
                  dealerships[info.model][info.trim][1] +
                  ","}
                <button
                  style={{
                    marginLeft: "10px",
                    background: "none",
                    border: "none",
                    color: "blue",
                    textDecoration: "underline",
                    cursor: "pointer"
                  }}
                >
                  ...more
                </button>
              </h3>
            </div>
            <h2>
              <strong>Your Vehicle</strong>
            </h2>
            <h3 style={{ fontSize: "20px" }}>
              <strong>Engine</strong>{" " + info["engine_aspiration"]}
            </h3>
            <h3 style={{ fontSize: "20px" }}>
              <strong>Drivetrain</strong>{" " + info["drivetrain"]}
            </h3>
            <h3 style={{ fontSize: "20px" }}>
              <strong>Transmission</strong>{" " + info["transmission"]}
            </h3>
            <h3 style={{ fontSize: "20px" }}>
              <strong>Body Style</strong>{" " + info["body_style"]}
            </h3>
          </div>
          <div style={{ textAlign: "right", paddingRight: "10px", margin: "3px" }}>
        <button style={{ float: "right" }}>
          <u>Detailed info</u>&#10148;
        </button>
      </div>
        </div>
      </div>
    </div>
  );
}
