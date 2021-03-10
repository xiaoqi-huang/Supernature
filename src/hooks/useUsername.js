import { useState } from 'react';


const useUsername = () => {

    const getToken = () => {
        const tokenString = localStorage.getItem('username');
        return tokenString ? JSON.parse(tokenString) : undefined;
    };

    const [username, setUsername] = useState(getToken());

    const saveToken = (token) => {
        localStorage.setItem('username', JSON.stringify(token));
        setUsername(token.username);
    };

    return {
        username,
        setUsername: saveToken
    }
};

export default useUsername;