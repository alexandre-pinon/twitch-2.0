import React from 'react';
import { Row, Col } from 'react-bootstrap';
import ControlledCarousel from '../carousel';
import CarouselCard from '../carouselCard';

function Home() {
  return (
    <div>
          <Row className="row--With--Shadow">
            <Col>
            <ControlledCarousel/>
            </Col>
            <Col>
            <CarouselCard/>
            </Col>
          </Row>
    </div>
  );
}

export default Home;
