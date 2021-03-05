import React from 'react';
import ReactDOM from 'react-dom';
import { getBlogList } from "../actions/blog";


export default class BlogPage extends React.Component {

    state = {
        text: '',
        sortBy: 'updatedAt',
        page: 0,
        blogList: '',
    };

    onTextChange = (e) => {
        this.setState(() => ({
            text: e.target.value,
            page: 0
        }));
    };

    onSortChange = (e) => {
        this.setState(() => ({
            sortBy: e.target.value,
            page: 0
        }));

        getBlogList(this.state.sortBy, this.state.page).then((blogList) => {
            console.log('CP4');
            const list = blogList.map((blog) => (<li key={blog['aid']}>{blog['title']}</li>));
            this.setState(() => ({
                blogList: list
            }));
        });
    };

    loadPrevPage = () => {

        this.setState(() => ({
            page: this.state.page - 1
        }));

        getBlogList(this.state.sortBy, this.state.page).then((blogList) => {
            console.log('CP3');
            const list = blogList.map((blog) => (<li key={blog['aid']}>{blog['title']}</li>));
            this.setState(() => ({
                blogList: list
            }));
        });
    };

    loadNextPage = () => {

        this.setState(() => ({
            page: this.state.page + 1
        }));

        getBlogList(this.state.sortBy, this.state.page).then((blogList) => {
            console.log('CP2');
            const list = blogList.map((blog) => (<li key={blog['aid']}>{blog['title']}</li>));
            this.setState(() => ({
                blogList: list
            }));
        });
    };

    onSetup = () => {
        getBlogList(this.state.sortBy, this.state.page).then((blogList) => {
            console.log('CP1');
            const list = blogList.map((blog) => (<li key={blog['aid']}>{blog['title']}</li>));
            // ReactDOM.render(list, document.getElementById('blog-list'));
            this.setState(() => ({
                blogList: list
            }));
        });
    };

    render() {

        getBlogList(this.state.sortBy, this.state.page).then((blogList) => {
            console.log('CP1');
            const list = blogList.map((blog) => (<li key={blog['aid']}>{blog['title']}</li>));
            ReactDOM.render(list, document.getElementById('blog-list'));
        });

        return (
            <div>
                <div>
                    <input
                        type="text"
                        value={this.state.text}
                        onChange={this.onTextChange}
                    />
                    <span>Sort By</span>
                    <select
                        value={this.state.sortBy}
                        onChange={this.onSortChange}
                    >
                        <option value="updatedAt">Edit Date</option>
                        <option value="createdAt">Create Date</option>
                    </select>
                    <button onClick={this.loadPrevPage}>Prev</button>
                    <span>Page {this.state.page + 1}</span>
                    <button onClick={this.loadNextPage}>Next</button>
                </div>
                <div id="blog-list">{this.state.blogList}</div>
            </div>
        );
    }
}