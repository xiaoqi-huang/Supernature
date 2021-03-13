import React from 'react';
import {connect} from 'react-redux';
import BlogList from "./BlogList";
import {getBlogListByUser} from "../api/blog";


class BlogView extends React.Component {

    state = {
        blogList: []
    };

    componentDidMount() {
        getBlogListByUser(this.props.user.uid).then((data) => {
            this.setState(() => ({
                blogList: data.blog_list
            }));
        });
    }

    render() {
        return (
            <div id="view">
                <div className="title">Blog List</div>
                <div className="description">You have written {this.state.blogList.length} article{this.state.blogList.length > 1 ? 's' : ''}.</div>
                <BlogList blogList={this.state.blogList} />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps)(BlogView);