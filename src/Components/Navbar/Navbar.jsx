import React, { useState, useCallback, useEffect } from 'react';
import { useRef } from 'react';
import styles from './Navbar.module.css';
import { useDataContext } from '../../Context/DataContext';
// import { Hamburger, Tv } from '../../Assets/index';
// import { Link, useNavigate } from 'react-router-dom';
import { useNavigate } from 'react-router'

export const Navbar = ({ setSearchQuery }) => {

    const [displaySuggestions, setDisplaySuggestions] = useState(false)
    const [overSuggestion, setOverSuggestions] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const [searchTxt, setSearchTxt] = useState("")
    const { state, dispatch, setLocalStorage, removeLocalStorage } = useDataContext()
    const navigate = useNavigate()

    const inputRef = useRef(null);
    const itemListRef = useRef(null)
    useEffect(() => {
        // const div = inputRef.current;
        // subscribe event
        document.addEventListener("mousedown", handleMouseDown);
        return () => {
            // unsubscribe event
            document.removeEventListener("mousedown", handleMouseDown);
        };
    }, []);

    function checkXYInElement(x, y, elem) {

        // let rect = { x: elem.current.offsetLeft+16, y: elem.current.offsetParent.offsetTop, w: elem.current.offsetWidth, h: elem.current.offsetHeight };
        let rect = {
            offsetLeft: elem.current.offsetLeft,
            width: elem.current.offsetWidth,
            offsetTop: elem.current.offsetParent.offsetTop,
            height: elem.current.offsetHeight
        }
        // let rect = {x: elem.offset().left, y: elem.offset().top, w: elem.outerWidth(), h: elem.outerHeight()};
        if (x > rect.offsetLeft && y > rect.offsetTop && x < (rect.offsetLeft + rect.width) && y < (rect.offsetTop + rect.height)) {
            return true;
        }
        return false;
    }

    function checkXYInElementList(x, y, elem) {

        // let rect = { x: elem.current.offsetLeft+16, y: elem.current.offsetParent.offsetTop, w: elem.current.offsetWidth, h: elem.current.offsetHeight };
        let rect = {
            offsetLeft: elem.current.offsetLeft,
            width: elem.current.offsetWidth,
            offsetTop: elem.current.offsetParent.offsetTop + 44,
            height: elem.current.offsetHeight
        }
        // let rect = {x: elem.offset().left, y: elem.offset().top, w: elem.outerWidth(), h: elem.outerHeight()};
        if (x > rect.offsetLeft && y > rect.offsetTop && x < (rect.offsetLeft + rect.width) && y < (rect.offsetTop + rect.height)) {
            return true;
        }
        return false;
    }


    const handleMouseDown = event => {

        let x = event.clientX; // event.offsetX
        let y = event.clientY; // event.offsetY

        if (checkXYInElement(x, y, inputRef) || checkXYInElementList(x, y, itemListRef)) {
            console.log("its running")
            setDisplaySuggestions(() => true)
        }
        else {

            setDisplaySuggestions(() => false)
            setSelectedIndex(-1)
        }
    }

    const handleSearchSubmit = e => {
        e.preventDefault()
        console.log("it ran")
        setSearchQuery(() => searchTxt)
        if (!state.prevSearchQueries.find(query => query === searchTxt) && searchTxt !== "") {
            dispatch({ type: 'NEW_SEARCH_QUERY', payload: searchTxt })
            navigate(`/search/${searchTxt}`)
            setLocalStorage(searchTxt)
        }
        setDisplaySuggestions(false)
    }

    const handleSeachInput = e => {
        setSearchTxt(() => e.target.value)
    }

    

    // handel the key down event of the search input
    function handleSearcherInputKeyDown(Event) {
        if (state.prevSearchQueries.length !== 0) {
            // use keyboard to select the suggesions
            handleSelectSuggestions(Event);
        }
    }

    // use use keyboards to select the suggestions
    function handleSelectSuggestions(Event) {
        // 40 => down, 38 => up
        if (Event.keyCode == 40 || Event.keyCode == 38) {
            Event.preventDefault();
            if (Event.keyCode == 40) {
                setSelectedIndex(prevIndex => prevIndex < state.prevSearchQueries.length ? prevIndex + 1 : prevIndex)
            } else {
                setSelectedIndex(prevIndex => prevIndex !== 0 ? prevIndex - 1 : prevIndex)
            }
        }
        else {
            // 13 => enter
            if (Event.keyCode == 13) {
                Event.preventDefault();
                if (state.prevSearchQueries[selectedIndex] !== undefined
                    && state.prevSearchQueries[selectedIndex] !== "") {
                    setDisplaySuggestions(false)
                    setSearchTxt(() => state.prevSearchQueries[selectedIndex])

                    navigate(`/search/${state.prevSearchQueries[selectedIndex]}`)
                    setSelectedIndex(-1)
                }
                else if (searchTxt !== "") {
                    if(!state.prevSearchQueries.find(query => query === searchTxt) ) {
                        setLocalStorage(searchTxt)
                        dispatch({ type: 'NEW_SEARCH_QUERY', payload: searchTxt })
                    }
                    navigate(`/search/${searchTxt}`)
                    
                    setDisplaySuggestions(false)
                }
            }
        }
    }

    let suggestions = null;
    if (displaySuggestions && state.prevSearchQueries.length !== 0) {
        suggestions = state.prevSearchQueries.map(function (value, index) {
            return (
                <div
                    className={styles.navbar__searchSuggestionItem}
                    onClick={(e) => {
                        setSearchTxt(() => value)
                        handleSearchSubmit(e)
                        setDisplaySuggestions(false)
                        navigate(`/search/${value}`)
                    }}
                    style={{ backgroundColor: index == selectedIndex ? "whitesmoke" : "white" }}
                >
                    {value}
                </div>
            );
        });
    }

    return (

        <header className={styles.header}>
            <nav id={styles.navbar}>
                <div className={styles.navbar__toggleLabel}>
                    <div className={styles.navbar__logo}>
                        <span className={styles.navbar__logoText} onClick={() => navigate('/')}>Beautiful Photos</span>
                    </div>
                    <div className={styles.navbar__searchBox}>
                        <form
                            onSubmit={handleSearchSubmit}
                            autocomplete="off"
                        >
                            <input
                                type="text"
                                placeholder="Search..."
                                className={styles.navbar__inputBox}
                                name="search_bar"
                                onChange={handleSeachInput}
                                value={searchTxt}
                                ref={inputRef}
                                onKeyDown={handleSearcherInputKeyDown}
                            />
                        </form>
                        {
                            (
                                <div
                                    className={styles.navbar__searchBoxSuggestions}
                                    ref={itemListRef}
                                >
                                    {suggestions}
                                    {suggestions !== null && <button onClick={removeLocalStorage}>clear</button>}
                                </div>
                            )
                        }
                    </div>
                </div>
            </nav>
        </header>
    )
}