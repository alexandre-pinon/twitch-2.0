import Axios from "axios";
import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";

function Login() {
    const [formEmail, setFormEmail] = useState("");
    const [formPassword, setFormPassword] = useState("");

    return (
    <div className="auth-form">
        <h2>Log in</h2>
        <form className="form" onSubmit={"Login Test"}>
        <label htmlFor="form-email">Email</label>
        <input
            id="form-email"
            type="email"
            value={formEmail}
            onChange={(e) => setFormEmail(e.target.value)}
        />

        <label htmlFor="form-password">Password</label>
        <input
            id="form-password"
            type="password"
            value={formPassword}
            onChange={(e) => setFormPassword(e.target.value)}
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