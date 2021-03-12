import React from 'react';
import { connect } from "react-redux";
import { addComment } from "../api/blog";


class CommentForm extends React.Component {

    state = {
        aid: this.props.aid,
        error: null
    };

    handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        addComment(this.state.aid, formData).then((data) => {
            if (data.success) {
                location.reload();
            }
            if (data.error) {
                this.setState(() => ({
                    error: data.error
                }));
            }
        })
    };

    render() {
        return (
          <form id="comment-form" onSubmit={this.handleSubmit}>
              {this.state.error && <p>{this.state.error}</p>}
              <input type="text" name="content"
                     placeholder={this.props.user.signedIn ? "Write your comment" : "Sign in to comment"} />
              <button type="submit" disabled={!this.props.user.signedIn}>Comment</button>
          </form>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps)(CommentForm);