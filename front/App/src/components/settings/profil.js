import React from 'react';
import { InputGroup, FormControl, Form, Button,} from 'react-bootstrap';



function SettingsProfil() {

  return (
    <div className="container containProfil">
        <h2 className="titleHP">Profil</h2>
        <Form>
            <div className="row">
                <div className="col-md-12">
                    <Form.Group style={{marginTop: "1%"}} controlId="formFile">
                        <Form.Label>Default file input example</Form.Label>
                        <Form.Control type="file" />
                    </Form.Group>
                </div>
                <div className="col-md-6">
                <Form.Group style={{marginTop: "1%"}} controlId="firstname">
                    <Form.Control  type="firstname" placeholder="Prénom" />
                </Form.Group>
                </div>
                <div className="col-md-6">
                    <Form.Group style={{marginTop: "1%"}} controlId="lastname">
                        <Form.Control  type="lastname" placeholder="Nom" />
                    </Form.Group>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <InputGroup style={{marginTop: "1%"}}>
                        <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                        <Form.Control
                        placeholder="Username"
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                        />
                    </InputGroup>
                </div>
                <div style={{marginTop: "1%"}} className="col-md-12">
                    <Form.Control
                    as="textarea"
                    placeholder="Description"
                    style={{ height: '100px' }}
                    />
                </div> 
                <div className="col-md-12">
                    <Button style={{width:"100%", marginTop: "1%"}} variant="primary" type="submit">
                        Submit
                    </Button>
                </div>
            </div>
        </Form>
    </div>
  )
}

export default SettingsProfil