const getBlogList = (sort, page) => {
    const promise = fetch(`http://127.0.0.1:5000/api/blog/list/${sort}/${page}`);

    return promise.then((response) => (
        response.json()
    )).then((data) => {
        return data;
    });
};


export { getBlogList }