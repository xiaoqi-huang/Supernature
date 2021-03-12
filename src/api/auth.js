const authCheckUserStatus = () => {

    const promise = fetch('http://localhost:5000/api/auth/check-user-status');

    return promise.then((response) => (
        response.json()
    )).then((data) => {
        return data;
    });
};

const authSignIn = (formData) => {

    console.log(formData);
    const promise = fetch('http://localhost:5000/api/auth/sign-in', {
        method: 'POST',
        body: formData
    });

    return promise.then((response) => (
        response.json()
    )).then((data) => {
        return data;
    });
};

const authSignOut = () => {

    const promise = fetch('http://localhost:5000/api/auth/sign-out');

    return promise.then((response) => (
        response.json()
    )).then((data) => {
        return data;
    });
};

const authSignUp = (formData) => {

    const promise = fetch('http://localhost:5000/api/auth/sign-up', {
        method: 'POST',
        body: formData
    });

    return promise.then((response) => (
        response.json()
    )).then((data) => {
        return data;
    });
};

export { authCheckUserStatus, authSignIn, authSignOut, authSignUp }