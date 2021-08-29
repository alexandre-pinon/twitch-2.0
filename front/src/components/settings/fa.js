import React from 'react';
import axios from 'axios';

function Request (e) {
    e.preventDefault();   

    /* const data  */
        axios.post('http://localhost:1337/', /* data */)
        .then(response => {
            this.setState({
                message: ''
            })
            console.log(response)
        })
        .catch(error => {
            console.log(error)
        })
        
        var prompt = window.prompt('Veuillez entrez les 6 chiffres')

}

function FaAuth() {

  return (
    <div className="container">
        <h2 className="titleHP">2FA Authentification</h2>
        <div style={{textAlign: 'left'}} className="row">
            <p>
            Le 2fa est une méthode d'authentification 
            électronique dans laquelle un utilisateur n'est autorisé à accéder à un site Web 
            ou à une application qu'après avoir présenté avec succès deux éléments.             
            </p>
            <p>Pour activez le 2FA :</p>
            <ul>
                <li>Appuyer sur le bouton </li>
                <li>Scanner le QRCode a l'écran</li>
                <li>Entrez les 6 chiffres dans la petite fenêtre</li>
            </ul>
            <center>
                <btn onClick={Request} className="btn btn-secondary">
                    Obtenez votre QR code
                </btn>                
                <div className="QRCode">

                </div>
            </center>
        </div>
    </div>
  )
}

export default FaAuth
