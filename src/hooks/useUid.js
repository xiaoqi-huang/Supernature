import { useState } from 'react';


const useUid = () => {

    const getToken = () => {
        const tokenString = localStorage.getItem('uid');
        return tokenString ? JSON.parse(tokenString) : undefined;
    };

    const [uid, setUid] = useState(getToken());

    const saveToken = (token) => {
        localStorage.setItem('uid', JSON.stringify(token));
        setUid(token.uid);
    };

    return {
        uid,
        setUid: saveToken
    }
};

export default useUid;