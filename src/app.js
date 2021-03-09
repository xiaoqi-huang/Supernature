import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './components/HomePage';
import BlogListPage from './components/BlogListPage';
import BlogPage from './components/BlogPage';
import NotFoundPage from './components/NotFoundPage';
import './styles/styles.scss';
// import { ThemeProvider } from '@material-ui/styles';
// import CssBaseline from '@material-ui/core/CssBaseline';
// import { theme } from './styles/Theme';
import 'normalize.css/normalize.css';


class App extends React.Component {

    render() {
        return (
            <BrowserRouter>
                <NavBar />
                <Switch>
                    <Route exact path="/" component={HomePage} />
                    <Route path="/home" component={HomePage} />
                    <Route exact path="/blog" component={BlogListPage} />
                    <Route path="/blog/:id" component={BlogPage} />
                    {/*<Route path="/members" component={MembersPage} />*/}
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