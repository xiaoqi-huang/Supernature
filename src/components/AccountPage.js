import React from 'react';
import { connect } from 'react-redux';
import SideBar from "./SideBar";
import BlogView from "./BlogView";
import GeneralView from "./GeneralView";
import PasswordView from "./PasswordView";
import {authCheckUserStatus} from "../api/auth";
import {signin} from "../actions/user";


class AccountPage extends React.Component {

    state = {
        active: 'GENERAL'
    };

    toggleActive = (active) => {
        this.setState(() => ({
            active: active
        }));
    };

    componentDidMount() {
        authCheckUserStatus().then((response) => {
            if (response.signed_in) {
                this.props.dispatch(signin(response.uid, response.username));
            } else{
                this.props.history.push('/sign-in');
            }
        }).catch((error) => {
            console.log(`ERROR: ${error}`);
        });
    }

    render() {
        return (
            <div id="account-page">
                <div id="account-page-container">
                    <SideBar active={this.state.active} toggleActive={this.toggleActive} />
                    { this.state.active === 'GENERAL' && <GeneralView /> }
                    { this.state.active === 'BLOG' && <BlogView/> }
                    { this.state.active === 'PASSWORD' && <PasswordView/> }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps)(AccountPage);