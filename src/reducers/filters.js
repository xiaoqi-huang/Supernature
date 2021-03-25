const defaultFilters = {
    text: '',
    sortBy: 'updatedAt',
    page: 1,
    blogList: []
};

export default (state = defaultFilters, action) => {
    switch (action.type) {
        case 'SET_TEXT_FILTER':
            return {
                ...state,
                text: action.text
            };
        case 'SORT_BY_CREATE_TIME':
            return {
                ...state,
                sortBy: 'createdAt'
            };
        case 'SORT_BY_UPDATE_TIME':
            return {
                ...state,
                sortBy: 'updatedAt'
            };
        case 'SET_PAGE':
            return {
                ...state,
                page: action.page
            };
        case 'SET_BLOG_LIST':
            return {
                ...state,
                blogList: action.blogList
            };
        default:
            return state;
    }
};