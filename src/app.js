import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { Provider } from 'react-redux';
import configureStore from "./store/configureStore";
import { signin } from "./actions/user";

import AccountPage from "./components/AccountPage";
import AddBlogPage from "./components/AddBlogPage";
import BlogListPage from './components/BlogListPage';
import BlogPage from './components/BlogPage';
import EditBlogPage from "./components/EditBlogPage";
import HomePage from './components/HomePage';
import NavBar from './components/NavBar';
import NotFoundPage from './components/NotFoundPage';
import NotificationPage from "./components/NotificationPage";
import SignInPage from "./components/SignInPage";
import SignUpPage from "./components/SignUpPage";
import UserPage from "./components/UserPage";

import { authCheckUserStatus } from "./api/auth";

import 'normalize.css/normalize.css';
import './styles/styles.scss';




// import { ThemeProvider } from '@material-ui/styles';
// import CssBaseline from '@material-ui/core/CssBaseline';
// import { theme } from './styles/Theme';


const store = configureStore();

authCheckUserStatus().then((response) => {
    if (response.signed_in) {
        store.dispatch(signin(response.uid, response.username));
    }
}).catch((error) => {
    console.log(`ERROR: ${error}`);
});

const App = () => (
    <BrowserRouter>
        <NavBar />
        <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/home" component={HomePage} />
            <Route exact path="/blog" component={BlogListPage} />
            <Route exact path="/blog/:id([0-9]+)" component={BlogPage} />
            <Route exact path="/blog/add" component={AddBlogPage} />
            <Route exact path="/blog/edit/:id([0-9]+)" component={EditBlogPage} />
            {/*<Route path="/members" component={MembersPage} />*/}
            <Route path="/user/:id" component={UserPage} />
            <Route path="/account" component={AccountPage} />
            <Route path="/notification" component={NotificationPage} />
            <Route path="/sign-in" component={SignInPage} />
            <Route path="/sign-up" component={SignUpPage} />
            <Route component={NotFoundPage} />
        </Switch>
    </BrowserRouter>
);

const jsx = (
    <Provider store={store}>
        <App />
    </Provider>
);

// const materialApp = (
//     <ThemeProvider theme={theme}>
//         <CssBaseline/>
//         <Home/>
//     </ThemeProvider>
// );

ReactDOM.render(jsx, document.getElementById('app'));