import React from 'react';
import BlogList from './BlogList';
import {connect} from "react-redux";

class UserPage extends React.Component {

    state = {
        uid: null,
        username: null,
        intro: null,
        blogList: []
    };

    componentDidMount() {
        
    }

    render() {
        return (
            <div>
                <div>{this.state.username}</div>
                <div>{this.state.intro}</div>
                <BlogList blogs={this.state.blogList} />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps)(UserPage);