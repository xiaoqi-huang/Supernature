import React from 'react';
import {connect} from "react-redux";
import {apiUpdatePassword, authSignOut} from "../api/auth";
import {signout} from "../actions/user";

class PasswordView extends React.Component {

    state = {
        currPwd: '',
        newPwd1: '',
        newPwd2: ''
    };

    handleCurrPwdChange = (e) => {
        this.setState(() => ({
            currPwd: e.target.value
        }));
    };

    handleNewPwd1Change = (e) => {
        this.setState(() => ({
            newPwd1: e.target.value
        }));
    };

    handleNewPwd2Change = (e) => {
        this.setState(() => ({
            newPwd2: e.target.value
        }));
    };

    handleDiscard = (e) => {
        e.preventDefault();
        this.setState(() => ({
            currPwd: '',
            newPwd1: '',
            newPwd2: ''
        }));
    };

    handleSubmit = (e) => {

        e.preventDefault();

        const formData = new FormData(e.target);
        apiUpdatePassword(formData).then((response1) => {
            if (response1.success) {
                authSignOut().then((response2) => {
                    if (response1.success) {
                        this.props.dispatch(signout());
                        this.props.history.push('/sign-in');
                    }
                });
            }
            if (response1.error) {
                this.setState(() => ({
                    error: data.error
                }));
            }
        })
    };

    render() {
        return (
            <div id="view">
                <div className="title">Password Setting</div>
                <div className="description">Change your password.</div>
                <form id="password-form" onSubmit={this.handleSubmit}>
                    {this.state.error && <p>{this.state.error}</p>}
                    <label htmlFor="currPassword">
                        Current password</label>
                        <input type="password" name="currPassword"
                               value={this.state.currPwd} onChange={this.handleCurrPwdChange} required />

                    <label htmlFor="newPassword1">
                        New password
                        <input type="password" name="newPassword1"
                               value={this.state.newPwd1} onChange={this.handleNewPwd1Change} required />
                    </label>
                    <label htmlFor="newPassword2">
                        Retype new password
                        <input type="password" name="newPassword2"
                               value={this.state.newPwd2} onChange={this.handleNewPwd2Change} required />
                    </label>
                    <div className="button-container">
                        <button className="discard-btn" onClick={this.handleDiscard}
                                disabled={!this.state.currPwd || !this.state.newPwd1 || !this.state.newPwd2 || this.state.newPwd1 !== this.state.newPwd2}>
                            Discard Changes
                        </button>
                        <button className="submit-btn" type="submit"
                                disabled={!this.state.currPwd || !this.state.newPwd1 || !this.state.newPwd2 || this.state.newPwd1 !== this.state.newPwd2}>
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps)(PasswordView);