const getBlogList = (sort, page) => {

    const promise = fetch(`http://localhost:5000/api/blog/list/${sort}/${page}`);

    return promise.then((response) => (
        response.json()
    )).then((data) => {
        return data;
    });
};

const getBlog = (aid) => {

    const promise = fetch(`http://localhost:5000/api/blog/${aid}`);

    return promise.then((response) => (
        response.json()
    )).then((data) => {
        return data;
    });
};

const getRawBlog = (aid) => {

    const promise = fetch(`http://localhost:5000/api/blog/raw/${aid}`);

    return promise.then((response) => (
        response.json()
    )).then((data) => {
        return data;
    });
};

const getCommentList = (aid) => {

    const promise = fetch(`http://localhost:5000/api/blog/comments/${aid}`);

    return promise.then((response) => (
        response.json()
    )).then((data) => {
        return data;
    });
};

const getReplyList = (cid) => {

    const promise = fetch(`http://localhost:5000/api/blog/replies/${cid}`);

    return promise.then((response) => (
        response.json()
    )).then((data) => {
        return data;
    });
};

const addBlog = (formData) => {

    const promise = fetch('http://localhost:5000/api/blog/add', {
        method: 'POST',
        credentials: 'include',
        body: formData
    });

    return promise.then((response) => (
        response.json()
    )).then((data) => {
        return data;
    });
};

const editBlog = (aid, formData) => {

    const promise = fetch(`http://localhost:5000/api/blog/edit/${aid}`, {
        method: 'POST',
        credentials: 'include',
        body: formData
    });

    return promise.then((response) => (
        response.json()
    )).then((data) => {
        return data;
    });
};

export { getBlogList, getBlog, getRawBlog, getCommentList, getReplyList, addBlog, editBlog };