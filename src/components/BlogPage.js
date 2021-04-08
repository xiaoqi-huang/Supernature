import React from 'react';
import { Link } from 'react-router-dom';
import CommentForm from './CommentForm';
import {deleteBlog, getBlog, getCommentList} from '../api/blog';
import CommentList from "./CommentList";
import { connect } from 'react-redux';
import { toLocal } from '../utils/time';
import EditIcon from '@material-ui/icons/Edit';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';

class BlogPage extends React.Component {

    state = {
        aid: this.props.match.params.id,
        title: null,
        content: null,
        createAt: null,
        updateAt: null,
        uid: 0,
        author: null,
        comments: []
    };

    handleDelete = () => {

        deleteBlog(this.state.aid).then((response) => {
            if (response.error) {
                this.setState(() => ({
                    error: response.error
                }));
            }
            if (response.success) {
                this.props.history.push('/blog');
            }
        });
    };

    addComment = (comment) => {

        let comments = this.state.comments;
        comments.unshift(comment);

        this.setState(() => ({
            comments: comments
        }));
    };

    handleExpand = () => {
        const showReplyButtons = document.getElementsByClassName('show-reply-btn collapsed');
        Array.from(showReplyButtons).forEach((button) => {
            button.click();
        })
    };

    handleCollapse = () => {
        const showReplyButtons = document.getElementsByClassName('show-reply-btn expanded');
        Array.from(showReplyButtons).forEach((button) => {
            button.click();
        })
    };

    componentDidMount() {

        getBlog(this.state.aid).then((blog) => {
           this.setState(() => ({
               title: blog['title'],
               content: blog['content'],
               createAt: blog['createAt'],
               updateAt: blog['updateAt'],
               uid: blog['uid'],
               author: blog['author']
           }));
        });

        getCommentList(this.state.aid).then((comments) => {
            this.setState(() => ({
                comments: comments
            }));
        });
    }

    render() {
        return (
            <div id="blog-page" className="page">
                <div id="article">
                    <div>
                        <Link to="/blog" id="back-link">{"<< back"}</Link>
                    </div>
                    <div id="article-title">
                        { this.state.error && <p className="msg">{this.state.error}</p> }
                        <h1>{this.state.title}</h1>
                        <div id="article-info-container">
                            <Link id="article-author" to={`/user/${this.state.uid}`}>{this.state.author}</Link>
                            {
                                this.props.user.signedIn && (this.props.user.uid === this.state.uid) &&
                                <div id="article-edit-delete-container">
                                    <Link id="article-edit-link" to={`/blog/edit/${this.state.aid}`}>
                                        Edit
                                        <EditIcon />
                                    </Link>
                                    <button id="article-delete-btn" onClick={this.handleDelete}>
                                        Delete
                                        <DeleteRoundedIcon />
                                    </button>
                                </div>
                            }
                        </div>
                    </div>
                    <div id="article-content" dangerouslySetInnerHTML={{__html: this.state.content}} />
                    <div id="article-update-time">Edited at {toLocal(this.state.updateAt)}</div>
                    <div id="article-create-time">Posted at {toLocal(this.state.createAt)}</div>
                    <CommentForm aid={this.state.aid} addComment={this.addComment} />
                    <div id="expand-collapse-buttons">
                        <button onClick={this.handleExpand}>Expand All</button>
                        <button onClick={this.handleCollapse}>Collapse All</button>
                    </div>
                    <CommentList comments={this.state.comments} />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps)(BlogPage);