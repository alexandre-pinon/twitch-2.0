import React from "react";
import { Row, Col } from "react-bootstrap";
import ControlledCarousel from "../carousel";
import CarouselCard from "../carouselCard";
import TwitcHeader from "../twitchAPI/TwitchHeader";
import Stream from "../twitchAPI/Streams";
import Games from "../twitchAPI/Games";
function Home() {
  return (
    <div>
      <Row className="row--With--Shadow">
        <Col>
          <ControlledCarousel />
        </Col>
        <Col>
          <CarouselCard />
        </Col>
        <Col>
          <TwitcHeader />
          <Stream />
        </Col>
      </Row>
    </div>
  );
}

export default Home;
