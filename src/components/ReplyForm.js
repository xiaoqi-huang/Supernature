import React from "react";
import {connect} from "react-redux";
import {addReply} from "../api/blog";


class ReplyForm extends React.Component {

    state = {
        cid: this.props.cid,
        error: null
    };

    handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        addReply(this.state.cid, formData).then((data) => {
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
            <form className="reply-form" onSubmit={this.handleSubmit}>
                {this.state.error && <p>{this.state.error}</p>}
                <input type="text" name="content"
                    placeholder={this.props.user.signedIn ? "Write your reply" : "Sign in to reply"} />
                <button type="submit" disabled={!this.props.user.signedIn}>Reply</button>
            </form>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps)(ReplyForm);

