import { initialDataState } from "../Context/DataContext"

export const DataReducer = (state, action) => {
    switch (action.type) {
        case 'INITIALIZE_DATA':
            return {
                ...state, prevSearchQueries: action.payload
            }
        case 'NEW_SEARCH_QUERY':
            return {
                ...state, prevSearchQueries: [...new Set([action.payload, ...state.prevSearchQueries])]
                // [...new Set([...prevBooks, ...resp.data.docs.map(b => b.title)])]
            }
        case 'REMOVE_DATA':
            return {
                ...initialDataState
            }
        default:
            return state;
    }
}