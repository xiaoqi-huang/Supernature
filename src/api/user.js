import port from './settings';


const getUserInfo = (uid) => {

    const promise = fetch(`http://localhost:${port}/api/user/${uid}`);

    return promise.then((response) => (
        response.json()
    )).then((data) => {
        return data;
    });
};

const getCurrUserInfo = () => {

    const promise = fetch(`http://localhost:${port}/api/user/current`);

    return promise.then((response) => (
        response.json()
    )).then((data) => {
        return data;
    });
};

const updateUserInfo = (formData) => {


    const promise = fetch(`http://localhost:${port}/api/user/update-info`, {
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