import React from 'react';
import { Link } from 'react-router-dom';
import { authSignIn } from '../api/auth';
import {connect} from "react-redux";
import {checkUserStatus, signin} from "../actions/user";


class SignInPage extends React.Component {

    state = {
        emailEntered: false,
        pwdEntered: false
    };

    handleEmailChange = (e) => {
        this.setState(() => ({
            emailEntered: e.target.value.length > 0 && e.target.value.match(/.+@.+/)
        }))
    };

    handlePwdChange = (e) => {
        this.setState(() => ({
            pwdEntered: e.target.value.length > 0
        }))
    };

    handleSubmit = (e) => {

        e.preventDefault();

        const formData = new FormData(e.target);
        authSignIn(formData).then((data) => {
            this.props.dispatch(signin(data.uid, data.username));
            this.props.history.push('/');
        })
    };

    render() {
        return (
            <div id="sign-in-form-container">
                <form id="sign-in-form" onSubmit={this.handleSubmit}>
                    <div id="sign-in-form__title">
                        <span>supernatural</span>
                        <span>psychology</span>
                        <span>association</span>
                    </div>
                    <div id="sign-in-form__subtitle"><p>Sign in with an SPA account</p></div>
                    <input
                        id="email"
                        type="email"
                        name='email'
                        placeholder="Email"
                        onChange={this.handleEmailChange}
                        required
                    />
                    <input
                        id="password"
                        type="password"
                        name='password'
                        placeholder="Password"
                        onChange={this.handlePwdChange}
                        required
                    />
                    <div id="forgot-pwd-container">
                        <a>Forgot your password?</a>
                    </div>
                    <button
                        type="submit"
                        disabled={!this.state.emailEntered || !this.state.pwdEntered}
                    >
                        Sign in
                    </button>
                    <div id="sign-up-container">
                        Don't have an SPA account?
                        <Link to='/sign-up'>Sign up</Link>
                    </div>
                </form>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps)(SignInPage);