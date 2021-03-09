import React from "react";

export default class ReplyForm extends React.Component {

    state = {
        aid: this.props.cid,
        comment: null
    };

    onSubmit = (e) => {
        e.preventDefault();
    };

    render() {
        return (
            <form className="reply-form" onSubmit={this.onSubmit}>
                <input
                    type="text"
                    placeholder="Write your reply"
                />
                <button>Reply</button>
            </form>
        );
    }
}