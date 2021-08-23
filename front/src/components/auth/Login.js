import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // Axios Call for Login
    function login(e) {
        e.preventDefault();
        const retrieveData = {
            username,
            password,
        };

        axios
            .post('http://localhost:8001/user/login', 
                retrieveData,
            )
            .then((response) => {
                console.log(response);
                if (response.status == 200) {
                    window.location = "http://localhost:3000/" 
            }
            })
            .catch(e => {
                console.error(e);
            });
    }

    return (
    <div className="auth-form">
        <h2>Log in</h2>
        <form className="form" onSubmit={login}>
        <label htmlFor="form-username">username</label>
        <input
            id="form-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="form-password">Password</label>
        <input
            id="form-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn-submit" type="submit">
            Log in
        </button>
        </form>
        <p>
        Don't have an account yet? <Link to="/register">Register here.</Link>
        </p>
    </div>
    );
}

export default Login;
