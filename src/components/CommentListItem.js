import React from 'react';
import ReplyList from './ReplyList';
import ReplyForm from './ReplyForm';
import { getReplyList } from "../api/blog";
import {toLocal} from "../utils/time";

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
            replies: [],
            showReplies: false
        };
    }

    addReply = (reply) => {
        let replies = this.state.replies;
        replies.unshift(reply);
        this.setState(() => ({
            replies: replies
        }), () => {
            this.setState(() => ({
                showReplies: true
            }));
        });
    };

    handleBtnClick = (e) => {
        this.setState((prevState) => ({
            showReplies: !prevState.showReplies
        }), () => {
            e.target.innerText = e.target.innerText === '▲' ? '▼' : '▲';
        });
    };

    toggleReplyForm = (e) => {
        this.setState((prevState) => ({
            showReplyForm: !prevState.showReplyForm
        }), () => {
            e.target.innerText = e.target.innerText === '+' ? '−' : '+';
        });
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
                <p className="create-time">{toLocal(this.state.createAt)}</p>
                <div className="button-container">
                    {this.state.replies && this.state.replies.length !== 0
                    && <button id={`comment-${this.state.cid}-btn`} className="show-reply-btn"
                               onClick={this.handleBtnClick}>▲</button>}
                    <button className="reply-form-btn" onClick={this.toggleReplyForm}>+</button>
                </div>
                {this.state.showReplyForm && <ReplyForm cid={this.state.cid} addReply={this.addReply} />}
                {this.state.showReplies && ((this.state.replies.length === 0 && <p>No reply</p>) || <ReplyList replies={this.state.replies} />)}
            </div>
        );

    }
}