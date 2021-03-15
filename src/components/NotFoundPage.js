import React from 'react';
import { Link } from 'react-router-dom';

export default class NotFoundPage extends React.Component {
    render() {
        return (
            <div id="not-found-page" className="page">
                <div id="not-found-page__msg">404: Page Not Found</div>
                <Link to="/home">Go Home</Link>
            </div>
        );
    }
}