import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import ControlledCarousel from '../carousel';
import CarouselCard from '../carouselCard';

function Home() {
  return (
    <div id="container">
        <Container>
          <Row>
            <Col>
            <ControlledCarousel/>
            </Col>
            <Col>
            <CarouselCard/>
            </Col>
          </Row>
        </Container>
    </div>
  );
}

export default Home;
