import React from 'react';
import {authCheckUserStatus} from "../api/auth";
import {getNotification} from "../api/user";
import Notification from "./Notification";

export default class NotificationPage extends React.Component {

    state = {
        notifications: []
    };

    componentDidMount() {
        authCheckUserStatus().then((response) => {
            if (!response.signed_in) {
                this.props.history.push('/sign-in');
            }
        }).catch((error) => {
            this.setState(() => ({
                error: error
            }));
        });

        getNotification().then((response) => {
            if (response.error) {
                this.setState(() => ({
                    error: response.error
                }));
            } else {
                console.log(response.data);
                this.setState(() => ({
                    notifications: response.data
                }));
            }
        })
    }

    render() {
        return (
            <div id="notification-page">
                <div id="notification-page__container">
                    <h1>Notifications</h1>
                    { this.state.error && <p className="msg">{this.state.error}</p> }
                    { this.state.notifications.map((notification) => <Notification key={notification.cid + '' + notification.aid + notification.uid + notification.rid} {...notification} />) }
                </div>
            </div>
        )
    }
}