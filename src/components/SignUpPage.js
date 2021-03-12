import React from 'react';
import { Link } from "react-router-dom";
import { authSignUp } from "../api/auth";


export default class SignUpPage extends React.Component {

    state = {
        usernameEntered: false,
        emailEntered: false,
        pwd1: null,
        pwd2: null
    };

    handleUsernameChange = (e) => {
        this.setState(() => ({
            usernameEntered: e.target.value.length > 0
        }))
    };

    handleEmailChange = (e) => {
        this.setState(() => ({
            emailEntered: e.target.value.length > 0 && e.target.value.match(/.+@.+/)
        }))
    };

    handlePwd1Change = (e) => {
        this.setState(() => ({
            pwd1: e.target.value
        }))
    };

    handlePwd2Change = (e) => {
        this.setState(() => ({
            pwd2: e.target.value
        }));
    };

    handleSubmit = (e) => {

        e.preventDefault();

        const formData = new FormData(e.target);
        authSignUp(formData).then((data) => {
            this.props.history.push('/sign-in');
        })
    };

    render() {
        return (
            <div id="sign-up-form-container">
                <form id="sign-up-form" onSubmit={this.handleSubmit}>
                    <div id="sign-up-form__title">
                        <span>supernatural</span>
                        <span>psychology</span>
                        <span>association</span>
                    </div>
                    <div id="sign-up-form__subtitle"><p>Create an SPA account</p></div>
                    <input
                        id="username"
                        type="text"
                        name="username"
                        placeholder="Username"
                        onChange={this.handleUsernameChange}
                        required
                    />
                    <input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={this.handleEmailChange}
                        required
                    />
                    <input
                        id="password"
                        type="password"
                        name="password1"
                        placeholder="Password"
                        onChange={this.handlePwd1Change}
                        required
                    />
                    <input
                        id="password"
                        type="password"
                        name="password2"
                        placeholder="Re-enter your password"
                        onChange={this.handlePwd2Change}
                        className={this.state.pwd2 && (this.state.pwd1 !== this.state.pwd2) ? "invalid" : "valid"}
                        required
                    />
                    <button
                        type="submit"
                        disabled={!this.state.usernameEntered || !this.state.emailEntered || !this.state.pwd1 || !this.state.pwd2 || (this.state.pwd1 !== this.state.pwd2)}
                    >
                        Sign up
                    </button>
                    <div id="sign-in-container">
                        Have an SPA account already?
                        <Link to='/sign-in'>Sign in</Link>
                    </div>
                </form>
            </div>
        );
    }
}