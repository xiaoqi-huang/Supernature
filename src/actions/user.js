const checkUserStatus = () => {
    return {
        type: 'CHECK_USER_STATUS'
    };
};

const signin = (uid, username) => ({
    type: 'SIGN_IN',
    uid,
    username
});

const signout = () => ({
    type: 'SIGN_OUT'
});

export { checkUserStatus, signin, signout }