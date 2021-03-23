import React from 'react';
import { toLocal } from "../utils/time";


const ReplyListItem = ({rid, content, createAt, uid, author}) => (
    <div className="reply-list-item">
        <a href={`/user/${uid}`}>{author}</a>
        <p>{content}</p>
        <p className="create-time">{toLocal(createAt)}</p>
    </div>
);

export default ReplyListItem;