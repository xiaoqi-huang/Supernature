const getUserInfo = (uid) => {

    const promise = fetch(`/api/user/${uid}`);

    return promise.then((response) => (
        response.json()
    )).then((data) => {
        return data;
    });
};

const getCurrUserInfo = () => {

    const promise = fetch('/api/user/current');

    return promise.then((response) => (
        response.json()
    )).then((data) => {
        return data;
    });
};

const updateUserInfo = (formData) => {


    const promise = fetch('/api/user/update-info', {
        method: 'POST',
        body: formData
    });

    return promise.then((response) => (
        response.json()
    )).then((data) => {
        return data;
    });
};

export { getUserInfo, getCurrUserInfo, updateUserInfo };