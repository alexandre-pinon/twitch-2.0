import React from 'react';
import { Col, Form, Button, Row} from 'react-bootstrap';
import axios from 'axios';



class FormsBackground extends React.Component {

    constructor (props) {
        super(props)
        this.state = {
            profilPicture :'',
            lastName: '',
            firstName: '',
            Email: '',
            color: '',
            description:''
        }
        this.handleChange = this.handleChange.bind(this)
        this.Picture = this.Picture.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    Picture(e){
        this.setState({
            'profilPicture' : e.target.result,
        })
        let files = e.target.files;
        let reader = new FileReader();
        reader.readAsDataURL(files[0])

        reader.onload=(e)=>{
            console.warn('file data', e.target.result)
            const filePicture = {picture : e.target.result}
/*             axios.post('...', filePicture)
            .then(response => console.log('resultPP', response)) */
        }
    }

    handleChange(e) {
        this.setState({
            [e.target.name] : e.target.value,
        })
    }

    handleSubmit(e) {
        e.preventDefault();   
        const {lastName} = this.state
        const {firstName}= this.state
        const {Email} = this.state
        const {color} = this.state
        const {profilPicture} = this.state;
        const {description}= this.state;

        const data = { ProfilPicture : profilPicture, lastName : lastName, firstName : firstName, email : Email, color : color, Description: description}            

/*             axios.post('...', data)
            .then(response => {                
                this.setState({
                    profilPicture :'',
                    lastName: '',
                    firstName: '',
                    Email: '',
                    color: '',
                    description:''
                })
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            })   */  
    }

    render() {

        const {profilPicture,lastName, firstName, color ,description} = this.state

        return(
            <form onSubmit={this.handleSubmit}>
               <div className="col-md-12">
                <Form.Group as={Row} style={{marginTop: "1%"}}>
                  <Form.Label column sm="2">
                    color
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control column sm="10" style={{height: "15vh"}} type="color" defaultValue="#fff" title="Choose your color" id='color' name='color' value={color} onChange={this.handleChange}/>
                  </Col>
                </Form.Group>
                </div>
            </form>
        )
    }

}

function Background() {

  return (
    <div className="container containProfil">
        <h2 className="titleHP">Personnalisation</h2>
        <FormsBackground/>
    </div>
  )
}

export default Background