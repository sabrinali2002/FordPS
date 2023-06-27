//start express web server
const express = require('express');
const os = require('os');

const app = express();
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
  let response = {
    msg: 'hello! see below routes in order to use application',
    hostname: os.hostname().toString(),
    routes: {}
  }
  res.json(response);
})

app.listen(port, ()=>{
    console.log('Server listening at port %d', port);
});