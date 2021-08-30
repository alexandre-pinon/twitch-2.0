import React from "react";
import { Col, Form, Button, Row } from "react-bootstrap";
import axios from "axios";

class FormsProfil extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profilPicture: "",
      lastName: "",
      firstName: "",
      Email: "",
      username: "",
      description: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.Picture = this.Picture.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  Picture(e) {
    this.setState({
      profilPicture: e.target.result,
    });
    let files = e.target.files;
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);

    reader.onload = (e) => {
      console.warn("file data", e.target.result);
      const filePicture = { picture: e.target.result };
      /*             axios.post('...', filePicture)
            .then(response => console.log('resultPP', response)) */
    };
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { lastName } = this.state;
    const { firstName } = this.state;
    const { Email } = this.state;
    const { username } = this.state;
    const { profilPicture } = this.state;
    const { description } = this.state;

    const data = {
      ProfilPicture: profilPicture,
      lastName: lastName,
      firstName: firstName,
      email: Email,
      username: username,
      Description: description,
    };

    /*             axios.post('...', data)
            .then(response => {                
                this.setState({
                    profilPicture :'',
                    lastName: '',
                    firstName: '',
                    Email: '',
                    username: '',
                    description:''
                })
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            })   */
  }

  render() {
    const { profilPicture, lastName, firstName, username, description } =
      this.state;

      function Click(param) {
        
      }

    return (
      <form onSubmit={this.handleSubmit}>
        <div className="row">
          <div className="col-md-12">
            <Form.Group className="mb-3">
              <Form.Label>Default file input example</Form.Label>
              <Form.Control
                type="file"
                accept="image/png, image/jpeg"
                id="profilPicture"
                value={profilPicture}
                name="profilPicture"
                onChange={this.Picture}
              />
            </Form.Group>
          </div>
          <div className="col-md-6">
            <Form.Group style={{ marginTop: "1%" }}>
              <Form.Control
                type="text"
                placeholder="Prénom"
                id="firstName"
                name="firstName"
                value={firstName}
                onChange={this.handleChange}
              />
            </Form.Group>
          </div>
          <div className="col-md-6">
            <Form.Group style={{ marginTop: "1%" }}>
              <Form.Control
                type="text"
                placeholder="Nom"
                id="lastName"
                name="lastName"
                value={lastName}
                onChange={this.handleChange}
              />
            </Form.Group>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <Form.Group as={Row} style={{ marginTop: "1%" }}>
              <Form.Label column sm="2">
                @
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  column
                  sm="10"
                  type="text"
                  placeholder="username"
                  id="username"
                  name="username"
                  value={username}
                  onChange={this.handleChange}
                />
              </Col>
            </Form.Group>
          </div>
          <div style={{ marginTop: "1%" }} className="col-md-12">
            <Form.Control
              as="textarea"
              placeholder="Description"
              style={{ height: "100px" }}
              id="description"
              name="description"
              value={description}
              onChange={this.handleChange}
            />
          </div>
          <div className="col-md-12">
            <Button
              style={{ width: "100%", marginTop: "1%" }}
              variant="primary"
              type="submit"
            >
              Submit
            </Button>
          </div>
        </div>
        <center>
          <btn onClick={Click} className='btn btn-secondary'>
            Générer votre clé pour streamer 
          </btn>
        </center>
      </form>
    );
  }
}

function SettingsProfil() {
  return (
    <div className="container containProfil">
      <h2 className="titleHP">Profil</h2>
      <FormsProfil />
    </div>
  );
}

export default SettingsProfil;
