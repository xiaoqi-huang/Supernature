import React from 'react';
import { withRouter } from 'react-router';
import { Link } from "react-router-dom";
import {toLocal} from "../utils/time";


const Notification = (props) => {
    return (
        <div className="notification">
            <div onClick={() => {props.history.push(`/blog/${props.aid}`)}}>
                <div>
                    <Link className="from-user" to={`/user/{props.uid}`} >{props.author}</Link>
                    { props.isComment && "commented your" }
                    { props.isReply && "replied your" }
                    <span className="to-content">{props.target}</span>:
                </div>
                <p>{props.content}</p>
                <p className="created-time">{toLocal(props.createdAt)}</p>
            </div>
        </div>
    )
};

export default withRouter(Notification);