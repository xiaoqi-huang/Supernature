import React from 'react';


const ReplyListItem = ({rid, content, createAt, uid, author}) => (
    <div className="reply-list-item">
        <a href={`/user/${uid}`}>{author}</a>
        <p>{content}</p>
        <p className="create-time">{createAt}</p>
    </div>
);

export default ReplyListItem;