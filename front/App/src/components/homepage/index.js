import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import ControlledCarousel from '../carousel';

function Home() {
  return (
    <div className="container">
        <Container>
          <Row>
            <Col>
            <ControlledCarousel/>
            </Col>
          </Row>
        </Container>
    </div>
  );
}

export default Home;
