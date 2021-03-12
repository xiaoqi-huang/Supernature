import React from 'react';
import { Link } from 'react-router-dom';


const BlogListItem = ({aid, title, createAt, updateAt, uid, author}) => (
    <div className="blog-list-item">
        <div className="blog-list-item-title">
            <Link to={`/blog/${aid}`}><h3>{title}</h3></Link>
        </div>
        <div className="blog-list-item-info">
            <Link to={`/user/${uid}`}><p className='author'>{author}</p></Link>
            <p>Created at: {createAt}</p>
            <p>Updated at: {updateAt}</p>
        </div>
    </div>
);

export default BlogListItem;
