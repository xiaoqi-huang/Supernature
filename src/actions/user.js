const signin = (uid, username, intro, email) => ({
    type: 'SIGN_IN',
    uid,
    username,
    intro,
    email
});

const signout = () => ({
    type: 'SIGN_OUT'
});

export { signin, signout }