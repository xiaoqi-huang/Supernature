import React from 'react';


const BlogListItem = ({aid, title, createAt, updateAt, uid, author}) => (
    <div className="blog-list-item">
        <div className="blog-list-item-title">
            <a href={`/blog/${aid}`}><h3>{title}</h3></a>
        </div>
        <div className="blog-list-item-info">
            <a href={`/user/${uid}`}><p className='author'>{author}</p></a>
            <p>Created at: {createAt}</p>
            <p>Updated at: {updateAt}</p>
        </div>
    </div>
);

export default BlogListItem;
