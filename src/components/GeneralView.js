import React from 'react';
import {connect} from "react-redux";
import { withRouter } from 'react-router';
import {getCurrUserInfo, updateUserInfo} from "../api/user";
import {signin} from "../actions/user";

class GeneralView extends React.Component {

    state = {
        uid: null,
        currUsername: null,
        newUsername: null,
        currIntro: null,
        newIntro: null,
        currEmail: null,
        newEmail: null
    };

    handleUsernameChange = (e) => {
        this.setState(() => ({
            newUsername: e.target.value
        }));
    };

    handleIntroChange = (e) => {
        this.setState(() => ({
            newIntro: e.target.value
        }));
    };

    handleEmailChange = (e) => {
        this.setState(() => ({
            newEmail: e.target.value
        }));
    };

    handleDiscard = (e) => {
        e.preventDefault();
        this.setState((prevState) => ({
            newUsername: prevState.currUsername,
            newIntro: prevState.currIntro,
            newEmail: prevState.currEmail
        }));
    };

    handleSubmit = (e) => {

        e.preventDefault();

        const formData = new FormData(e.target);
        updateUserInfo(formData).then((response) => {
            if (response.error) {
                this.setState(() => ({
                    msg: response.error
                }));
            }
            if (response.success) {
                this.setState((prevState) => ({
                    msg: 'SUCCESS',
                    currUsername: prevState.newUsername,
                    currIntro: prevState.newIntro,
                    currEmail: prevState.newEmail
                }), () => {
                    this.props.dispatch(signin(this.state.uid, this.state.currUsername));
                });
            }
        })
    };

    componentDidMount() {
        getCurrUserInfo().then((data) => {
            this.setState(() => ({
                uid: data.uid,
                currUsername: data.username,
                newUsername: data.username,
                currIntro: data.intro,
                newIntro: data.intro,
                currEmail: data.email,
                newEmail: data.email
            }));
        })
    }

    render() {
        return (
            <div id="view">
                <div className="title">General Settings</div>
                <div className="description">Manage your username, bio and email address.</div>

                <form id="general-form" onSubmit={this.handleSubmit}>
                    { this.state.msg && <p className="msg">{this.state.msg}</p> }
                    <div className="title">Account Info</div>
                    {/*<div className="description">UID: {this.state.uid}</div>*/}
                    <input type="text" name="username"
                           value={this.state.newUsername} onChange={this.handleUsernameChange}>
                    </input>
                    <input type="text" name="intro"
                           value={this.state.newIntro} onChange={this.handleIntroChange}>
                    </input>

                    <div className="title">Email Address</div>
                    <input type="email" name="email"
                           value={this.state.newEmail} onChange={this.handleEmailChange}>
                    </input>
                    <div className="button-container">
                        <button className="discard-btn" onClick={this.handleDiscard}
                                disabled={this.state.currUsername === this.state.newUsername && this.state.currIntro === this.state.newIntro && this.state.currEmail === this.state.newEmail}>
                            Discard Changes
                        </button>
                        <button className="submit-btn" type="submit"
                                disabled={this.state.currUsername === this.state.newUsername && this.state.currIntro === this.state.newIntro && this.state.currEmail === this.state.newEmail}>
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        )
    }
}

export default withRouter(connect()(GeneralView));