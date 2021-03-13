import React from 'react';
import ReplyListItem from "./ReplyListItem";


const ReplyList = (props) => (
    <div id="reply-list">
        {
            props.replies.map((reply) => <ReplyListItem key={reply.rid} {...reply} />)
        }
    </div>
);

export default ReplyList;