import React from 'react';
import BlogList from './BlogList';
import { getBlogList, getBlogListWithSearch, getBlogNumber, getBlogNumberWithSearch } from "../api/blog";
import { connect } from "react-redux";
import {setBlogList, setPage, setTextFilter, sortByCreateTime, sortByUpdateTime} from "../actions/filters";

class BlogListPage extends React.Component {

    state = {
        addBlog: false,
        text: this.props.filters.text,
        sortBy: this.props.filters.sortBy,
        page: this.props.filters.page,
        totalPage: 0,
        blogList: this.props.filters.blogList
    };

    scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    updateBlog = () => {

        const text = this.state.text;
        const sortBy = this.state.sortBy;
        const page = this.state.page - 1;

        if (!text) {
            getBlogList(sortBy, page).then((blogList) => {
                this.setState(() => ({
                    blogList: blogList
                }));
            }, () => {
                this.props.dispatch(setBlogList(this.state.blogList));
            });

            getBlogNumber().then((data) => {
                this.setState(() => ({
                    totalPage: Math.ceil(data.blog_number / 20)
                }));
            });
        } else {
            getBlogListWithSearch(text, sortBy, page).then((blogList) => {
                this.setState(() => ({
                    blogList: blogList
                }));
            }, () => {
                this.props.dispatch(setBlogList(this.state.blogList));
            });

            getBlogNumberWithSearch(this.state.text).then((data) => {
                this.setState(() => ({
                    totalPage: Math.ceil(data.blog_number / 20)
                }));
            });
        }

    };

    onTextChange = (e) => {
        this.setState(() => ({
            text: e.target.value
        }));
    };

    handleCancelSearch = () => {
        this.setState(() => ({
            text: ''
        }), () => {
            this.updateBlog();
            this.props.dispatch(setTextFilter());
        });
    };

    handleSearch = () => {
        this.updateBlog();
        this.props.dispatch(setTextFilter(this.state.text));
    };

    onSortChange = (e) => {

        this.setState(() => ({
            sortBy: e.target.value,
            page: 1
        }), () => {
            this.updateBlog();
        });

        switch (e.target.value) {
            case 'updatedAt':
                this.props.dispatch(sortByUpdateTime());
                break;
            case 'createdAt':
                this.props.dispatch(sortByCreateTime());
                break;
        }
    };

    loadPrevPage = () => {

        if (this.state.page <= 1) return;

        this.setState((prevState) => ({
            page: prevState.page - 1
        }), () => {
            this.updateBlog();
            this.props.dispatch(setPage(this.state.page));
        });
    };

    loadNextPage = () => {

        if (this.state.page >= this.state.totalPage) return;

        this.setState((prevState) => ({
            page: parseInt(prevState.page + 1)
        }), () => {
            this.updateBlog();
            this.props.dispatch(setPage(this.state.page));
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

        if (targetPage < 1 || targetPage > this.state.totalPage) return;

        this.setState(() => ({
            page: targetPage
        }), () => {
            this.updateBlog();
            this.props.dispatch(setPage(targetPage));
        });
    };

    handleAddBlog = () => {
        this.props.history.push('/blog/add');
    };

    componentDidMount() {
        this.updateBlog();
    }

    render() {
        return (
            <div id="blog-list-page" className="page">
                <div id="blog-list-page__container">
                    <div id="blog-list-filter">
                        <div id="page-selector">
                            <label htmlFor="page-input">Page:</label>
                            <input id="page-input"
                                   value={this.state.page} onChange={this.handlePageChange} />
                            / {this.state.totalPage}
                            <button onClick={this.loadPrevPage} disabled={this.state.page <= 1}>{'<'}</button>
                            <button onClick={this.loadNextPage} disabled={this.state.page >= this.state.totalPage}>{'>'}</button>
                        </div>

                        {this.props.user.signedIn && <button id="add-blog-btn" onClick={this.handleAddBlog}>Write Blog</button>}

                        <div id="sort-filter">
                            <label htmlFor="sort-select">Sort By:</label>
                            <select id="sort-select"
                                    value={this.state.sortBy} onChange={this.onSortChange}>
                                <option value="updatedAt">Edited Date</option>
                                <option value="createdAt">Posted Date</option>
                            </select>
                        </div>

                        <div id="search-filter">
                            <input type="text" id="search-input"
                                   value={this.state.text} onChange={this.onTextChange} />
                            <button id="cancel-search-btn" onClick={this.handleCancelSearch}
                                    disabled={!this.state.text}>
                                x
                            </button>
                            <button id="search-btn" onClick={this.handleSearch}
                                    disabled={!this.state.text}>
                                Search
                            </button>
                        </div>
                    </div>

                    {this.state.blogList && <BlogList blogList={this.state.blogList} />}

                    <div id="bottom-page-selector">
                        <button onClick={() => { this.loadPrevPage(); this.scrollToTop(); }}
                                disabled={this.state.page <= 1}>
                            Prev
                        </button>
                        <span className="page-label">
                            Page {this.state.page === '' ? '_' : this.state.page} / {this.state.totalPage}
                        </span>
                        <button onClick={() => { this.loadNextPage(); this.scrollToTop(); }}
                                disabled={this.state.page >= this.state.totalPage}>
                            Next
                        </button>
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