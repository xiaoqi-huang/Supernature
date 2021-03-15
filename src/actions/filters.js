const setTextFilter = (text = '') => ({
    type: 'SET_TEXT_FILTER',
    text
});

const sortByCreateTime = () => ({
    type: 'SORT_BY_CREATE_TIME'
});

const sortByUpdateTime = () => ({
    type: 'SORT_BY_UPDATE_TIME'
});

const setPage = (page) => ({
    type: 'SET_PAGE',
    page
});

export { setTextFilter, sortByCreateTime, sortByUpdateTime, setPage }
