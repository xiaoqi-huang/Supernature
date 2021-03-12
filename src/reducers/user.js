import {authCheckUserStatus} from "../api/auth";

const defaultUser = {
    uid: null,
    username: null,
    signedIn: false
};

export default (state = defaultUser, action) => {
    switch (action.type) {
        case 'CHECK_USER_STATUS':
            const tmp = authCheckUserStatus().then((response) => {
                console.log('REDUCER', response);
                if (response.signed_in) {
                    return {
                       uid: response.uid,
                       username: response.username,
                       signedIn: true
                    }
                } else {
                   return state;
                }
            }).catch((error) => {
                console.log(`ERROR: ${error}`);
                return state;
            });

            console.log('TMP', tmp.uid);
            return tmp;
        case 'SIGN_IN':
            return {
                uid: action.uid,
                username: action.username,
                signedIn: true
            };
        case 'SIGN_OUT':
            return {
                uid: null,
                username: null,
                signedIn: false
            };
        default:
            return state
    }
};