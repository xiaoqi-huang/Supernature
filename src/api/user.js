const getUserInfo = (uid) => {

    const promise = fetch(`http://localhost:5000/api/user/${uid}`);

    return promise.then((response) => (
        response.json()
    )).then((data) => {
        return data;
    });
};

export { getUserInfo };