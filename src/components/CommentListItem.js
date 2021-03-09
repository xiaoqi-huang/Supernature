import React from 'react';
import ReplyList from './ReplyList';
import ReplyForm from './ReplyForm';
import { getReplyList } from "../actions/blog";

export default class CommentListItem extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            cid: this.props.cid,
            content: this.props.content,
            createAt: this.props.createAt,
            uid: this.props.uid,
            author: this.props.author,
            showReplyForm: false,
            replies: null,
            showReplies: false
        };
    }

    handleBtnClick = (e) => {
        this.setState((prevState) => ({
            showReplies: !prevState.showReplies
        }), () => {
            e.target.innerText = e.target.innerText === 'Show Replies' ? 'Hide Replies' : 'Show Replies';
        });
    };

    toggleReplyForm = () => {
        this.setState((prevState) => ({
            showReplyForm: !prevState.showReplyForm
        }));
    };

    componentDidMount() {
        getReplyList(this.state.cid).then((replies) => {
            this.setState(() => ({
                replies: replies
            }));
        });
    }

    render() {
        return (
            <div className="comment-list-item">
                <a href={`/blog/${this.state.cid}`}>{this.state.author}</a>
                <p>{this.state.content}</p>
                <p className="create-time">{this.state.createAt}</p>
                <button onClick={this.toggleReplyForm}>Write Reply</button>
                {this.state.replies && this.state.replies.length !== 0 && <button onClick={this.handleBtnClick}>Show Replies</button>}
                {this.state.showReplyForm && <ReplyForm cid={this.state.cid} />}
                {this.state.showReplies && this.state.replies && ((this.state.replies.length === 0 && <p>No reply</p>) || <ReplyList replies={this.state.replies} />)}
            </div>
        );

    }
}