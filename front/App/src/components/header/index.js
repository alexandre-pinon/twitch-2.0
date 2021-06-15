import React, { useState }  from 'react';
import OffcanvasTitle from 'react-bootstrap/OffcanvasTitle';
import OffcanvasBody from 'react-bootstrap/OffcanvasBody';
import OffcanvasHeader from 'react-bootstrap/OffcanvasHeader';
import Offcanvas from 'react-bootstrap/OffCanvas';
import Button from 'react-bootstrap/Button';


const options = [
    {
      name: 'Enable body scrolling',
      scroll: true,
      backdrop: false,
    },
    {
      name: 'Enable backdrop (default)',
      scroll: false,
      backdrop: true,
    },
    {
      name: 'Enable both scrolling & backdrop',
      scroll: true,
      backdrop: true,
    },
  ];
  
  function OffCanvasExample({ name, ...props }) {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
        <section>
            <Button variant="primary" onClick={handleShow} className="me-2">
            {name}
            </Button>
            <Offcanvas show={show} onHide={handleClose} {...props}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Offcanvas</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                Some text as placeholder. In real life you can have the elements you
                have chosen. Like, text, images, lists, etc.
            </Offcanvas.Body>
            </Offcanvas>
        </section>
    );
  }
  
  function Example() {
    return (
        <div>
            {options.map((props, idx) => (
            <OffCanvasExample key={idx} {...props} />
            ))}
        </div>
    );
  }
  
 export default Example();