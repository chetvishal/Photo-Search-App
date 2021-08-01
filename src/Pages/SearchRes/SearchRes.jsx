import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import styles from './SearchRes.module.css';
import useBooksHook from '../../Hooks/useBooksHook';
import useImageSearch from '../../Hooks/useImageSearch';
import LoadingGif from '../../Assets/gif/loading.gif'
import { useDataContext } from '../../Context/DataContext';
import { useParams } from 'react-router-dom';
export const SearchRes = ({ searchQuery }) => {
    // const [images, setData] = useState([]);
    // const [query, setQuery] = useState('');
    const { prevSearchQueries } = useDataContext()
    const [pageNumber, setPageNumber] = useState(1)
    const { query } = useParams()
    console.log("query", query)
    
    const {
        images,
        hasMore,
        loading,
        error
    } = useImageSearch(query, pageNumber)

    console.log("prevSearchQueries: ", prevSearchQueries)

    const observer = useRef()
    const lastBookElementRef = useCallback(node => {
        if (loading) return
        if (observer.current) observer.current.disconnect() //because we will have to reconnect with new element and disconnect it from prev last element

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) { //entries[0] because we will be observing single node
                setPageNumber(prevPageNumber => prevPageNumber + 1)
            }
        })
        if (node) observer.current.observe(node)
    }, [loading, hasMore])



    return (
        <>
            <div className="searchRes">
                <h1>Search results for {query}</h1>
                <div className={styles.searchRes__photoList}>
                    {
                        images.map((image, index) => {
                            if (images.length === index + 1)
                                return (
                                    <img
                                        src={`https://live.staticflickr.com/${image.server}/${image.id}_${image.secret}_w.jpg`}
                                        alt="flicr images"
                                        className={styles.searchRes__image}
                                        ref={lastBookElementRef}
                                    />
                                )
                            else
                                return (
                                    <img
                                        src={`https://live.staticflickr.com/${image.server}/${image.id}_${image.secret}_w.jpg`}
                                        alt="flicr images"
                                        className={styles.searchRes__image}
                                    />
                                );
                        })
                    }
                    <div>{loading && <img src={LoadingGif} alt="loading" />}</div>
                    <div>{error && 'Error'}</div>
                </div>
            </div>
        </>
    )
}