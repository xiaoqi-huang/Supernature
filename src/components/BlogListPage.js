import React from 'react';
import BlogList from './BlogList';
import { getBlogList } from "../api/blog";
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import {sortByUpdateTime} from "../actions/filters";

class BlogListPage extends React.Component {

    state = {
        addBlog: false,
        text: '',
        sortBy: 'updatedAt',
        page: 0,
        blogList: []
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

    onTextChange = (e) => {
        this.setState(() => ({
            text: e.target.value,
            page: 0
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
            page: 0
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

    componentDidMount() {
        this.updateBlog();
    }

    render() {
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

                    {this.props.user.signedIn && <Link id="add-blog-link" to="/blog/add">+ BLOG</Link>}

                    <div id="page-selector">
                        <button onClick={this.loadPrevPage}>Prev</button>
                        <span className="page-label">Page {this.state.page + 1}</span>
                        <button onClick={this.loadNextPage}>Next</button>
                    </div>
                </div>

                {this.state.blogList && <BlogList blogList={this.state.blogList} />}

                <div id="bottom-page-selector">
                    <button onClick={() => { this.loadPrevPage(); this.scrollToTop(); }}>Prev</button>
                    <span className="page-label">Page {this.state.page + 1}</span>
                    <button onClick={() => { this.loadNextPage(); this.scrollToTop(); }}>Next</button>
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