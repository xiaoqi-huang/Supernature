import React from 'react';
import BlogList from './BlogList';
import {connect} from "react-redux";
import {getUserInfo} from "../api/user";
import {getBlogListByUser} from "../api/blog";
import {Link} from "react-router-dom";

class UserPage extends React.Component {

    state = {
        uid: Number(this.props.match.params.id),
        username: null,
        intro: null,
        email: null,
        blogList: []
    };

    componentDidMount() {

        getUserInfo(this.state.uid).then((data) => {
            if (data.error) {
                this.setState(() => ({
                    error: data.error
                }));
            } else {
                this.setState(() => ({
                    username: data.username,
                    intro: data.intro,
                    email: data.email
                }));
            }
        });

        getBlogListByUser(this.state.uid).then((data) => {
            if (data.error) {
                this.setState(() => ({
                    error: data.error
                }));
            } else {
                this.setState(() => ({
                    blogList: data.blog_list
                }));
            }
        });
    }

    render() {
        return (
            <div id="user-page">
                {this.state.error && <p>{this.state.error}</p>}
                <div id='user-info'>
                    <div id='user-info__username'>{this.state.username}</div>
                    <div id='user-info__intro'>{this.state.intro}</div>
                    {(this.props.user.uid === this.state.uid) && <Link to="/account" id="user-info__edit">Edit profile</Link>}
                </div>
                <div id="blog-page__blog-list">
                    <BlogList blogList={this.state.blogList} />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps)(UserPage);