import React from 'react';
import { addBlog } from "../actions/blog";

export default class AddBlogPage extends React.Component {

    handleCancel = () => {
        this.props.history.push('/blog');
    };

    handleSubmit = (e) => {

        e.preventDefault();

        const formData = new FormData(e.target);
        addBlog(formData).then((data) => {
            this.props.history.push(`/blog/${data['aid']}`);
        })
    };

    render() {
        return (
          <form id="add-blog-form" onSubmit={this.handleSubmit}>
              <input id="title-field" type="text" name="title" placeholder="Title" required />
              <textarea id="content-field" name="content" placeholder="Content" required />
              <div id="add-blog-form__btn-container">
                  <button className="cancel-btn" onClick={this.handleCancel}>CANCEL</button>
                  <button className="submit-btn" type="submit">SUBMIT</button>
              </div>
          </form>
        );
    }
}