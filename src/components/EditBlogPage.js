import React from 'react';

import { connect } from 'react-redux';
import { signout } from "../actions/user";

import { editBlog, getRawBlog } from "../api/blog";


class EditBlogPage extends React.Component {

    state = {
        aid: this.props.match.params.id,
        title: null,
        content: null,
        error: null
    };

    handleTitleChange = (e) => {
        this.setState(() => ({
            title: e.target.value
        }));
    };

    handleContentChange = (e) => {
        this.setState(() => ({
            content: e.target.value
        }));
    };

    handleCancel = (e) => {
        e.preventDefault();
        this.props.history.push('/blog');
    };

    handleSubmit = (e) => {

        e.preventDefault();

        const formData = new FormData(e.target);
        editBlog(this.state.aid, formData).then((data) => {
            if (data.success) {
                this.props.history.push(`/blog/${this.state.aid}`);
            }
            if (data.error && data.error === 'NOT_SIGNED_IN') {
                this.setState(() => ({
                    error: data.error
                }));
                this.props.dispatch(signout());
            }
        })
    };

    componentDidMount() {
        getRawBlog(this.state.aid).then((data) => {
            this.setState(() => ({
                title: data.title,
                content: data.content
            }));
        });
    }

    render() {
        return (
            <form id="add-blog-form" onSubmit={this.handleSubmit}>
                {this.state.error && <p>{this.state.error}</p>}
                <input id="title-field" type="text" name="title"
                       value={this.state.title} onChange={this.handleTitleChange} required />
                <textarea id="content-field" name="content"
                          value={this.state.content} onChange={this.handleContentChange} required />
                <div id="add-blog-form__btn-container">
                    <button className="cancel-btn" onClick={this.handleCancel}>CANCEL</button>
                    <button className="submit-btn" type="submit">SUBMIT</button>
                </div>
            </form>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps)(EditBlogPage);