import React from 'react';
// import { Link } from 'react-router-dom';

export default class HomePage extends React.Component {

    render() {
        return (
            <div>
                <div className="fullscreen">
                    <div id="home-container">
                        <div className="home-title">
                            Supernatural Psychology Association
                        </div>
                        {/*<div className="home-button-container">*/}
                            {/*<Link to="/blog">*/}
                                {/*Read Blog*/}
                            {/*</Link>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>
        );
    }
}