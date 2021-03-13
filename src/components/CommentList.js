import React from 'react';
import CommentListItem from "./CommentListItem";


const CommentList = (props) => (
    <div id="comment-list">
        {
            props.comments.map((comment) => <CommentListItem key={comment.cid} {...comment} />)
        }
    </div>
);

export default CommentList;