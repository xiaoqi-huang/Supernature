import React from 'react';
import CommentForm from './CommentForm';
import { getBlog, getCommentList } from '../actions/blog';
import CommentList from "./CommentList";

export default class BlogPage extends React.Component {

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
              <span id="article-title">{this.state.title}</span>
              <div id="article-author"><a href={`/user/${this.state.uid}`}>{this.state.author}</a></div>
              <div id="article-content" dangerouslySetInnerHTML={{__html: this.state.content}} />
              <div id="article-update-time">Updated at {this.state.updateAt}</div>
              <div id="article-create-time">Created at {this.state.createAt}</div>
              <CommentForm />
              <CommentList comments={this.state.comments} />
          </div>
        );
    }
}