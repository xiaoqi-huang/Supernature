import React from 'react';
import ReactDOM from 'react-dom';
import BlogList from './BlogList';
import { getBlogList } from "../actions/blog";

export default class BlogListPage extends React.Component {

    state = {
        text: '',
        sortBy: 'updatedAt',
        page: 0,
        blogList: null,
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

        this.updateBlog();
    };

    loadPrevPage = () => {

        if (this.state.page < 1) return;

        this.setState(() => ({
            page: this.state.page - 1
        }));

        this.updateBlog();
    };

    loadNextPage = () => {

        this.setState(() => ({
            page: this.state.page + 1
        }));

        this.updateBlog();
    };

    loadPrevPageScollToTop = () => {

        if (this.state.page < 1) return;

        this.setState(() => ({
            page: this.state.page - 1
        }));

        this.updateBlog();
        this.scrollToTop();
    };

    loadNextPageScollToTop = () => {

        this.setState(() => ({
            page: this.state.page + 1
        }));

        this.updateBlog();
        this.scrollToTop();
    };

    updateBlog = () => {
        getBlogList(this.state.sortBy, this.state.page).then((blogList) => {
            this.setState(() => ({
                blogList: blogList
            }));
        });
    };

    scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    render() {

        if (this.state.blogList == null) {
            this.updateBlog();
        }

        return (
            <div id="blog-list-page">
                <div id="blog-list-filter">
                    <span id="search-filter">
                        <span>Search:</span>
                        <input
                            type="text"
                            value={this.state.text}
                            onChange={this.onTextChange}
                        />
                    </span>

                    <span id="sort-filter">
                        <span id="sort-label">Sort By:</span>
                        <select
                            value={this.state.sortBy}
                            onChange={this.onSortChange}
                        >
                            <option value="updatedAt">Edit Date</option>
                            <option value="createdAt">Create Date</option>
                        </select>
                    </span>

                    <div id="page-selector">
                        <button onClick={this.loadPrevPage}>Prev</button>
                        <span className="page-label">Page {this.state.page + 1}</span>
                        <button onClick={this.loadNextPage}>Next</button>
                    </div>
                </div>

                {this.state.blogList != null && <BlogList blogList={this.state.blogList} />}

                <div id="bottom-page-selector">
                    <button onClick={this.loadPrevPageScollToTop}>Prev</button>
                    <span className="page-label">Page {this.state.page + 1}</span>
                    <button onClick={this.loadNextPageScollToTop}>Next</button>
                </div>
            </div>
        );
    }
}