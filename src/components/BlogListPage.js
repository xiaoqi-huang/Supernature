import React from 'react';
import BlogList from './BlogList';
import {getBlogList, getBlogNumber} from "../api/blog";
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import {sortByUpdateTime} from "../actions/filters";

class BlogListPage extends React.Component {

    state = {
        addBlog: false,
        text: '',
        sortBy: 'updatedAt',
        page: 1,
        totalPage: 0,
        blogList: []
    };


    updateBlog = () => {
        getBlogList(this.state.sortBy, this.state.page - 1).then((blogList) => {
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

    onTextChange = (e) => {
        this.setState(() => ({
            text: e.target.value,
            page: 1
        }));
    };

    onSortChange = (e) => {

        // if (e.target.value === 'updatedAt') {
        //     this.props.dispatch(sortByUpdateTime);
        // } else {
        //
        // }

        this.setState(() => ({
            sortBy: e.target.value,
            page: 1
        }), () => {
            this.updateBlog();
        });
    };

    loadPrevPage = () => {

        if (this.state.page < 1) return;

        this.setState((prevState) => ({
            page: prevState.page - 1
        }), () => {
            this.updateBlog();
        });
    };

    loadNextPage = () => {

        this.setState((prevState) => ({
            page: prevState.page + 1
        }), () => {
            this.updateBlog();
        });
    };

    handlePageChange = (e) => {
        const targetPage = e.target.value;
        if (targetPage === '') {
            this.setState(() => ({
                page: ''
            }));
            return;
        }
        if (targetPage < 1 || targetPage > this.state.totalPage) {
            return;
        }
        this.setState(() => ({
            page: targetPage
        }), () => {
            this.updateBlog()
        });
    };

    componentDidMount() {

        this.updateBlog();

        getBlogNumber().then((data) => {
            this.setState(() => ({
                totalPage: Math.ceil(data.blog_number / 20)
            }));
        });
    }

    render() {
        return (
            <div id="blog-list-page">
                <div>
                    <div id="blog-list-filter">
                        <span id="search-filter">
                            <label htmlFor="search-input">Search:</label>
                            <input type="text" id="search-input"
                                   value={this.state.text} onChange={this.onTextChange} />
                        </span>

                        <span id="sort-filter">
                            <label htmlFor="sort-select">Sort By:</label>
                            <select id="sort-select"
                                    value={this.state.sortBy} onChange={this.onSortChange}>
                                <option value="updatedAt">Edit Date</option>
                                <option value="createdAt">Create Date</option>
                            </select>
                        </span>

                        {this.props.user.signedIn && <Link id="add-blog-link" to="/blog/add">+ BLOG</Link>}

                        <div id="page-selector">
                            <label htmlFor="page-input">Page:</label>
                            <input id="page-input"
                                   value={this.state.page} onChange={this.handlePageChange} />
                            / {this.state.totalPage}
                            <button onClick={this.loadPrevPage} disabled={this.state.page <= 1}>Prev</button>
                            <button onClick={this.loadNextPage} disabled={this.state.page >= this.state.totalPage}>Next</button>
                        </div>
                    </div>

                    {this.state.blogList && <BlogList blogList={this.state.blogList} />}

                    <div id="bottom-page-selector">
                        <button onClick={() => { this.loadPrevPage(); this.scrollToTop(); }}
                                disabled={this.state.page <= 1}>
                            Prev</button>
                        <span className="page-label">Page {this.state.page} / {this.state.totalPage}</span>
                        <button onClick={() => { this.loadNextPage(); this.scrollToTop(); }}
                                disabled={this.state.page >= this.state.totalPage}>
                            Next</button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    filters: state.filters
});

export default connect(mapStateToProps)(BlogListPage);