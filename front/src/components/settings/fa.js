import React, { useEffect, useState } from 'react'
import axios from 'axios'
import QRCode from 'qrcode.react'

function FaAuth({ loggedUser }) {
  const [otpuri, setOtpuri] = useState('')

  useEffect(() => {
    if (loggedUser && loggedUser.hash2FA) {
      setOtpuri(
        `otpauth://totp/${loggedUser.username}?secret=${loggedUser.hash2FA}&issuer=${process.env.REACT_APP_NODE_SERVERNAME}`
      )
    }
  }, [loggedUser])

  const register2FA = async () => {
    try {
      const url = `${process.env.REACT_APP_BACK_ORIGIN}:${process.env.REACT_APP_BACK_PORT}/user/register2FA`
      const token = sessionStorage.getItem('TOKEN')
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await axios.post(url, {}, config)
      setOtpuri(
        `otpauth://totp/${loggedUser.username}?secret=${response.data.hash2FA}&issuer=${process.env.REACT_APP_NODE_SERVERNAME}`
      )
    } catch (error) {
      console.log(error)
    }
  }

  const confirm2FA = async () => {
    try {
      const prompt = window.prompt('Veuillez entrez les 6 chiffres')
      if (!prompt) return
      const url = `${process.env.REACT_APP_BACK_ORIGIN}:${process.env.REACT_APP_BACK_PORT}/user/activate2FA`
      const data = { accessKey: prompt }
      const token = sessionStorage.getItem('TOKEN')
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await axios.post(url, data, config)
      alert(response.data.message)
      window.location.reload()
    } catch (error) {
      console.log(error.response)
      if (error.response && error.response.data) alert(error.response.data.message)
    }
  }

  return (
    <div className="container">
      <h2 className="titleHP">2FA Authentification</h2>
      <div style={{ textAlign: 'left' }} className="row">
        <p>
          Le 2fa est une méthode d'authentification électronique dans laquelle un utilisateur n'est autorisé à accéder à
          un site Web ou à une application qu'après avoir présenté avec succès deux éléments.
        </p>
        <p>Pour activez le 2FA :</p>
        <ul>
          <li>Appuyer sur le bouton </li>
          <li>Scanner le QRCode a l'écran</li>
          <li>Entrez les 6 chiffres dans la petite fenêtre</li>
        </ul>
        <center>
          {otpuri ? (
            loggedUser.active2FA ? (
              <div className="QRCode">
                <QRCode value={otpuri} size={340}></QRCode>
              </div>
            ) : (
              <div>
                <btn onClick={confirm2FA} className="btn btn-secondary">
                  Confirm 2FA activation
                </btn>
                <div className="QRCode">
                  <QRCode value={otpuri} size={340}></QRCode>
                </div>
              </div>
            )
          ) : (
            <btn onClick={register2FA} className="btn btn-secondary">
              Activate 2FA
            </btn>
          )}
        </center>
      </div>
    </div>
  )
}

export default FaAuth
