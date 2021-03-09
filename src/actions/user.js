const getBlog = (id) => {

    const promise = fetch(`http://127.0.0.1:5000/api/blog/${id}`);

    return promise.then((response) => (
        response.json()
    )).then((data) => {
        console.log(promise);
        return data;
    });
};

export { getBlog }