import React from 'react';
import '../styles/Table.css'

const Table = (locs) => {
  console.log(locs)
  return (
    <table>
      <thead>
        <tr>
          <th>Dealership Name</th>
          <th>Address</th>
          <th>City</th>
        </tr>
      </thead>
      <tbody>
        {
            locs.loc.map((d)=>{
                let x = d.split(':');
                console.log(x);
                let y = x[1].split(',');
                let res = y.length===4 ? y[1] + " " + y[2] : y[1];
                return <tr><td>{x[0]}</td><td>{y[0]}</td><td>{res}</td></tr>
            })
        }
        {/* <tr>
          <td>John</td>
          <td>25</td>
          <td>New York</td>
        </tr>
        <tr>
          <td>Jane</td>
          <td>30</td>
          <td>London</td>
        </tr>
        <tr>
          <td>Mark</td>
          <td>35</td>
          <td>Paris</td>
        </tr> */}
      </tbody>
    </table>
  );
};

export default Table;