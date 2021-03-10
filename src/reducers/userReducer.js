import { createStore } from 'redux'
import {checkSignIn} from "../actions/auth";


const user = {
    signedIn: false,
    uid: null,
    username: null
};

const userReducer = (state = user, action) => {
    switch (action.type) {
        case 'update':
            checkSignIn().then(response => {
                if (response.signed_in && !state.signedIn) {
                    return {
                        signedIn: true,
                        uid: response.uid,
                        username: response.username
                    };
                } else if (!response.signed_in && state.signedIn) {
                    return {
                        signedIn: false,
                        uid: null,
                        username: null
                    };
                } else {
                    return state;
                }
            });
        default:
            return state
    }
};

const store = createStore(userReducer);

export default store;