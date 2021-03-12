import React from 'react';
import { Link } from 'react-router-dom';
import CommentForm from './CommentForm';
import { getBlog, getCommentList } from '../api/blog';
import CommentList from "./CommentList";
import {connect} from "react-redux";

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
          <div id="article">
              <div id="article-title">
                  <h1>{this.state.title}</h1>
                  {this.props.user.signedIn && (this.props.user.uid === this.state.uid) && <Link id="article-edit-link" to={`/blog/edit/${this.state.aid}`}>Edit</Link>}
                  <Link id="article-author" to={`/user/${this.state.uid}`}>{this.state.author}</Link>
              </div>
              <div id="article-content" dangerouslySetInnerHTML={{__html: this.state.content}} />
              <div id="article-update-time">Updated at {this.state.updateAt}</div>
              <div id="article-create-time">Created at {this.state.createAt}</div>
              <CommentForm aid={this.state.aid} />
              <CommentList comments={this.state.comments} />
          </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps)(BlogPage);