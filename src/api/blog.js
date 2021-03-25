export const getBlogNumber = () => {

    const promise = fetch(`/api/blog/count`);

    return promise.then((response) => (
        response.json()
    )).then((data) => {
        return data;
    });
};

export const getBlogNumberWithSearch = (text) => {

    const promise = fetch(`/api/blog/count/${text}`);

    return promise.then((response) => (
        response.json()
    )).then((data) => {
        return data;
    });
};

export const getBlogList = (sort, page) => {

    const promise = fetch(`/api/blog/list/${sort}/${page}`);

    return promise.then((response) => (
        response.json()
    )).then((data) => {
        return data;
    });
};

export const getBlogListWithSearch = (text, sort, page) => {

    const promise = fetch(`/api/blog/list/${text}/${sort}/${page}`);

    return promise.then((response) => (
        response.json()
    )).then((data) => {
        return data;
    });
};

export const getBlogListByUser = (uid) => {

    const promise = fetch(`/api/blog/list/${uid}`);

    return promise.then((response) => (
        response.json()
    )).then((data) => {
        return data;
    });
};

export const getBlog = (aid) => {

    const promise = fetch(`/api/blog/${aid}`);

    return promise.then((response) => (
        response.json()
    )).then((data) => {
        return data;
    });
};

export const getRawBlog = (aid) => {

    const promise = fetch(`/api/blog/raw/${aid}`);

    return promise.then((response) => (
        response.json()
    )).then((data) => {
        return data;
    });
};

export const addBlog = (formData) => {

    const promise = fetch('/api/blog/add', {
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

export const editBlog = (aid, formData) => {

    const promise = fetch(`/api/blog/edit/${aid}`, {
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

export const getCommentList = (aid) => {

    const promise = fetch(`/api/blog/comments/${aid}`);

    return promise.then((response) => (
        response.json()
    )).then((data) => {
        return data;
    });
};

export const addComment = (aid, formData) => {

    const promise = fetch(`/api/blog/comment/add/${aid}`, {
        method: 'POST',
        body: formData
    });

    return promise.then((response) => (
        response.json()
    )).then((data) => {
        return data;
    });
};

export const getReplyList = (cid) => {

    const promise = fetch(`/api/blog/replies/${cid}`);

    return promise.then((response) => (
        response.json()
    )).then((data) => {
        return data;
    });
};

export const addReply = (cid, formData) => {

    const promise = fetch(`/api/blog/reply/add/${cid}`, {
        method: 'POST',
        body: formData
    });

    return promise.then((response) => (
        response.json()
    )).then((data) => {
        return data;
    });
};