import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import Avatar from '@material-ui/core/Avatar'


function ChatPrivate(params) {

    function displayMessagePrivate() {
        document.getElementsByClassName('chatPrivate')[0].style.visibility = "visible"
    }

    function hiddenMessagePrivate() {
        document.getElementsByClassName('chatPrivate')[0].style.visibility = "hidden"
    }
    return (
        <div className="ChatPrivate">
            <div className="chatPrivate">
                <div className="headerPrivate">
                    <FontAwesomeIcon id="closePrivate" onClick={hiddenMessagePrivate} style={{marginLeft : "90%"}} icon={faTimes} />
                </div>
            </div>
            <div onClick={displayMessagePrivate} className="namePrivate">
                <Avatar style={{float:'left', height:"100%", width:"12%"}} /*alt={message.username}*/ src="/static/images/avatar/1.jpg" /> 
                <p style={{float:'right'}} >
                    name   
                </p>
            </div>
        </div>
    )
}


export default ChatPrivate;