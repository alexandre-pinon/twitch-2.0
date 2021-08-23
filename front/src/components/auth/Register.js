import Axios from "axios";
import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";

function Register() {
    const [formEmail, setFormEmail] = useState("");
    const [formPassword, setFormPassword] = useState("");
    const [formPasswordVerify, setFormPasswordVerify] = useState("");

    return (
    <div className="auth-form">
        <h2>Register a new account</h2>
        <form className="form" onSubmit={"Register Test"}>
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

        <label htmlFor="form-passwordVerify">Verify password</label>
        <input
            id="form-passwordVerify"
            type="password"
            value={formPasswordVerify}
            onChange={(e) => setFormPasswordVerify(e.target.value)}
        />

        <button className="btn-submit" type="submit">
            Register
        </button>
        </form>
        <p>
        Already have an account? <Link to="/login">Login here.</Link>
        </p>
    </div>
    );
}

export default Register;
