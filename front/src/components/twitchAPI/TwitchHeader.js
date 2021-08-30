import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Container } from 'react-bootstrap';

function TwitcHeader() {
  return (
    <section>
    <Navbar className="navbar justify-content-center" expand="lg" 
      bg="dark" variant="dark">
      <Container>
        <li className="nav-item nav-link">
          <Link className="nav1" to="/twitch-api">Top Games</Link>
        </li>
        <li className="nav-item nav-link">
          <Link className="nav1" to="/top-streams">Top Live Streams</Link>
        </li>
      </Container>
    </Navbar>
    </section>
  );
}

export default TwitcHeader;
