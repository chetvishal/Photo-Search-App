import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import styles from './Home.module.css';
import useBooksHook from '../../Hooks/useBooksHook';
import useImageFetch from '../../Hooks/useImageFetch';
import LoadingGif from '../../Assets/gif/loading.gif'

export const Home = () => {
    // const [images, setData] = useState([]);
    const [query, setQuery] = useState('');
    const [pageNumber, setPageNumber] = useState(1)
    const {
        images,
        hasMore,
        loading,
        error
    } = useImageFetch(pageNumber)

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

    // useEffect(() => {
    //     (async function fetchImages() {
    //         await axios
    //             .get(
    //                 "https://www.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=40f85ae4f0186a2164ce481627713ed3&format=json&nojsoncallback=1"
    //             )
    //             .then((resp) => {
    //                 // setData(() => resp.data.photos.photo);
    //                 console.log("resp.data.photos.photo from Home.jsx",resp );
    //             });
    //     })();
    // }, []);



    // const handleSearch = e => {
    //     setQuery(e.target.value)
    //     setPageNumber(1)
    // }


    return (
        <>
            <div className={styles.home}>
                <div className={styles.home__photoList}>
                    {
                        images.map((image, index) => {
                            if (images.length === index + 1)
                                return (
                                    <img
                                        src={`https://live.staticflickr.com/${image.server}/${image.id}_${image.secret}_w.jpg`}
                                        alt="flicr images"
                                        className={styles.home__image}
                                        ref={lastBookElementRef}
                                    />
                                )
                            else
                                return (
                                    <img
                                        src={`https://live.staticflickr.com/${image.server}/${image.id}_${image.secret}_w.jpg`}
                                        alt="flicr images"
                                        className={styles.home__image}
                                    />
                                );
                        })
                    }
                    <div>{loading && <img src={LoadingGif} alt="loading" />}</div>
                    <div>{error && 'Error'}</div>
                </div>
            </div>
            {/* <div>
                <input
                    type="text"
                    onChange={handleSearch}
                    value={query}
                />
                {
                    books.map((book, index) => {
                        if (books.length === index + 1) {
                            return <div
                                key={book}
                                ref={lastBookElementRef}
                            >{book}</div>
                        }
                        else
                            return <div
                                key={book}
                            >{book}</div>
                    })
                }
                <div>{loading && 'Loading...'}</div>
                <div>{error && 'Error'}</div>
            </div> */}
        </>
    )
}