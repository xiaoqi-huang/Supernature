import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './components/HomePage';
import BlogListPage from './components/BlogListPage';
import BlogPage from './components/BlogPage';
import SignInPage from "./components/SignInPage";
import UserPage from "./components/UserPage";
import NotFoundPage from './components/NotFoundPage';
import 'normalize.css/normalize.css';
import './styles/styles.scss';
import AddBlogPage from "./components/AddBlogPage";
// import { ThemeProvider } from '@material-ui/styles';
// import CssBaseline from '@material-ui/core/CssBaseline';
// import { theme } from './styles/Theme';
import store from './reducers/userReducer';

class App extends React.Component {

    componentDidMount() {
        store.dispatch({ type: 'update' })
    }

    render() {
        return (
            <BrowserRouter>
                <NavBar />
                <Switch>
                    <Route exact path="/" component={HomePage} />
                    <Route path="/home" component={HomePage} />
                    <Route exact path="/blog" component={BlogListPage} />
                    <Route exact path="/blog/:id([0-9]+)" component={BlogPage} />
                    <Route exact path="/blog/add" component={AddBlogPage} />
                    {/*<Route path="/members" component={MembersPage} />*/}
                    <Route path="/signin" component={SignInPage} />
                    <Route path="/user/:id" component={UserPage} />
                    <Route component={NotFoundPage} />
                </Switch>
            </BrowserRouter>
        );
    }
}

// const materialApp = (
//     <ThemeProvider theme={theme}>
//         <CssBaseline/>
//         <Home/>
//     </ThemeProvider>
// );

ReactDOM.render(<App />, document.getElementById('app'));