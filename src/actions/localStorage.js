const getToken = (key) => {
    const tokenString = localStorage.getItem(key);
    return JSON.parse(tokenString)
};

const setToken = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

export { getToken, setToken };