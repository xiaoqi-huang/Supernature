import React from 'react';


export default class CommentForm extends React.Component {

    state = {
        aid: this.props.aid,
        comment: null
    };

    handleSubmit = (e) => {
        e.preventDefault();
    };

    render() {
        return (
          <form id="comment-form" onSubmit={this.handleSubmit}>
              <input type="text" name="content" placeholder="Write your comment" />
              <button type="submit">Comment</button>
          </form>
        );
    }
}