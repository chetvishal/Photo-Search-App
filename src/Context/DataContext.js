import { createContext, useContext, useState, useReducer, useEffect } from "react";
import { DataReducer } from "../Reducer/DataReducer";

const DataContext = createContext();
export const useDataContext = () => useContext(DataContext);

export const initialDataState = {
    prevSearchQueries: []
}

export const DataContextProvider = ({ children }) => {

    // const { searchQueries } = JSON.parse(localStorage?.getItem('userData')) || { searchQueries: [] }

    // const prevSearchQueries = ["cars", "burj khalifa"]

    // localStorage.setItem("userData", JSON.stringify({ loggedIn: true, token: resp.data.accessToken, userId: resp.data.userId, username: resp.data.username }))

    useEffect(() => {
        const { prevSearchQueries } = JSON.parse(localStorage?.getItem('userData')) || { prevSearchQueries: [] }
        console.log("prevSearchQueries local: ", prevSearchQueries)
        dispatch({ type: 'INITIALIZE_DATA', payload: prevSearchQueries })
    }, [])


    const setLocalStorage = (payload) => {
        const { prevSearchQueries } = JSON.parse(localStorage?.getItem('userData')) || { prevSearchQueries: [] }
        prevSearchQueries.unshift(payload)
        localStorage.setItem("userData", JSON.stringify({prevSearchQueries}))
    }

    const removeLocalStorage = () => {
        localStorage.removeItem('userData')
        dispatch({type: 'REMOVE_DATA'})
    }

    const [state, dispatch] = useReducer(DataReducer, initialDataState);

    return (
        <DataContext.Provider value={{ state, dispatch, setLocalStorage, removeLocalStorage }}>
            {children}
        </DataContext.Provider>
    )

}