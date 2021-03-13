import React from 'react';
import BlogListItem from './BlogListItem';


const BlogList = (props) => (
    <div id="blog-list">
        {
            props.blogList.map((blog) => <BlogListItem key={blog.aid} {...blog} />)
        }
    </div>
);

export default BlogList;
