import React from 'react';


export default class CommentForm extends React.Component {

    state = {
        aid: this.props.aid,
        comment: null
    };

    onSubmit = (e) => {
        e.preventDefault();
    };

    render() {
        return (
          <form id="comment-form" onSubmit={this.onSubmit}>
              <input
                  type="text"
                  placeholder="Write your comment"
                  autoFocus
              />
              <button>Comment</button>
          </form>
        );
    }
}