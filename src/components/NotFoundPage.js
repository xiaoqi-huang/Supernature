import React from 'react';
import { Link } from 'react-router-dom';

export default class NotFoundPage extends React.Component {
    render() {
        return (
            <div id="not-found-page" className="page">
                <div id="not-found-page__msg">
                    <span>404:</span>
                    <span>Page Not Found</span>
                </div>
                <Link to="/home">Go Home</Link>
            </div>
        );
    }
}