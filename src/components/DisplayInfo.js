import data from '../images/image_link.json'
export default function DisplayInfo({info}){
    return <div
        style={{
          height: "400px",
          width: "900px", // Increase width to desired value
          display: "flex",
          float: "left",
          borderRadius: "15px", // Add this for rounded corners
          backgroundColor: "#d4e3fa",
          flexDirection:'column',
          margin: '10px'
        }}
      >
        <div>
        <div style = {{padding:"10px"}}>
          <div style = {{float: "right", width:"356px", height:"180px", margin:"20px", 
          backgroundColor:"white", borderRadius: "15px",
          boxShadow: "0 4px 2px -2px gray"}}>
            <img src = {data[info.model][info.trim]}></img>
            </div>
            <div style = {{marginLeft:"20px", marginTop:"10px"}}>
        <h1>{"2023 " + info.model + " " + info.trim}</h1>
        <h3><strong>Engine</strong>{" "+info['engine_aspiration']}</h3>
        <h3><strong>Drivetrain</strong>{" "+info['drivetrain']}</h3>
        <h3><strong>Transmission</strong>{" "+info['transmission']}</h3>
        <h3><strong>Body Style</strong>{" "+info['body_style']}</h3>
        </div>
        </div></div>
        <div></div>

      </div>
}