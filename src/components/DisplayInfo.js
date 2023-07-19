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
            <img style = {{float: "right", width:"250px", height:"200px", margin:"20px"}} src = {data[info.model]}></img>
        <h1>{"2023 " + info.model + " " + info.trim}</h1>
        <h3><strong>Engine</strong>{" "+info['engine_aspiration']}</h3>
        <h3><strong>Drivetrain</strong>{" "+info['drivetrain']}</h3>
        <h3><strong>Transmission</strong>{" "+info['transmission']}</h3>
        <h3><strong>Body Style</strong>{" "+info['body_style']}</h3>
        </div></div>
        <div></div>

      </div>
}