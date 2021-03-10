const getBlogList = (sort, page) => {

    const promise = fetch(`http://127.0.0.1:5000/api/blog/list/${sort}/${page}`);

    return promise.then((response) => (
        response.json()
    )).then((data) => {
        return data;
    });
};

const getBlog = (id) => {

    const promise = fetch(`http://127.0.0.1:5000/api/blog/${id}`);

    return promise.then((response) => (
        response.json()
    )).then((data) => {
        return data;
    });
};

const getCommentList = (aid) => {

    const promise = fetch(`http://127.0.0.1:5000/api/blog/comments/${aid}`);

    return promise.then((response) => (
        response.json()
    )).then((data) => {
        return data;
    });
};

const getReplyList = (cid) => {

    const promise = fetch(`http://127.0.0.1:5000/api/blog/replies/${cid}`);

    return promise.then((response) => (
        response.json()
    )).then((data) => {
        return data;
    });
};

const addBlog = (formData) => {

    const promise = fetch('http://127.0.0.1:5000/api/blog/add', {
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

export { getBlogList, getBlog, getCommentList, getReplyList, addBlog };