import {combineReducers, createStore} from 'redux';
import userReducer from '../reducers/user';
import filtersReducer from '../reducers/filters';


export default () => {
    return createStore(
        combineReducers({
                user: userReducer,
                filters: filtersReducer
        })
    );
};