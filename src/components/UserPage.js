import React from 'react';


const UserPage = (props) => {
    return (
        <div>
            User: {props.match.params.id}
        </div>
    );
};

export default UserPage;