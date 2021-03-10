const checkSignIn = () => {

    const promise = fetch('http://127.0.0.1:5000/api/sign-in');

    return promise.then((response) => (
        response.json()
    )).then((data) => {
        return data;
    });
};

const signIn = (formData) => {

    const promise = fetch('http://127.0.0.1:5000/api/sign-in', {
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

export { checkSignIn, signIn }