import React from 'react';
import { addBlog } from "../api/blog";


export default class AddBlogPage extends React.Component {

    state = {
        error: null
    };

    handleCancel = (e) => {
        e.preventDefault();
        this.props.history.push('/blog');
    };

    handleSubmit = (e) => {

        e.preventDefault();

        const formData = new FormData(e.target);
        addBlog(formData).then((data) => {
            if (data.success) {
                this.props.history.push(`/blog/${data['aid']}`);
            }
            if (data.error) {
                this.setState(() => ({
                    error: data.error
                }));
            }
        });
    };

    render() {
        return (
          <form id="add-blog-form" onSubmit={this.handleSubmit}>
              {this.state.error && <p>{this.state.error}</p>}
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