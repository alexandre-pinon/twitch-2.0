import React, { useEffect, useState } from "react";

function App() {
  return (
    <div className="row test">
      <Link to="/profile" className={classes.avatar}>
        <Avatar
          alt="Remy Sharp"
          src="/static/images/avatar/1.jpg"
          className={classes.large}
        />
      </Link>
      <div className="NameStreamer">
        <h2>Remy Sharp</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur.
        </p>
        <table id="table">
          <thead>
            <th>Followers</th>
            <th>Followings</th>
          </thead>
          <tbody>
            <tr>
              <td>
                <Link className="noLinkStyle" to="/followers">
                  1212891
                </Link>
              </td>
              <td>
                <Link className="noLinkStyle" to="/followings">
                  1212891
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="buttonDiv">
        <Button
          variant="contained"
          className="input-item marginTop"
          color="primary"
        >
          Suivre
        </Button>
      </div>
    </div>
  );
}

export default App;
