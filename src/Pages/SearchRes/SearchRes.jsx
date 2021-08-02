import { useState, useRef, useCallback } from 'react';
import styles from './SearchRes.module.css';
import useImageSearch from '../../Hooks/useImageSearch';
import LoadingGif from '../../Assets/gif/loading.gif'
import { useDataContext } from '../../Context/DataContext';
import { useParams } from 'react-router-dom';
import { ImageModal } from '../../Components/index';


export const SearchRes = () => {
    const { prevSearchQueries } = useDataContext()
    const [pageNumber, setPageNumber] = useState(1)
    const [openImage, setOpenImage] = useState({ openImage: false, url: "" })
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
            <div className={styles.searchRes}>
                <h1>Search results for {query}</h1>
                <div className={styles.searchRes__photoList}>
                    {
                        images.map((image, index) => {
                            if (images.length === index + 1)
                                return (

                                    <div className={styles.searchRes__photoContainer}>
                                        <img
                                            src={`https://live.staticflickr.com/${image.server}/${image.id}_${image.secret}_w.jpg`}
                                            alt="flicr images"
                                            className={styles.searchRes__image}
                                            ref={lastBookElementRef}
                                            onClick={() => setOpenImage({ openImage: true, url: `https://live.staticflickr.com/${image.server}/${image.id}_${image.secret}_w.jpg` })}
                                        />
                                    </div>
                                )
                            else
                                return (
                                    <div className={styles.searchRes__photoContainer}>
                                        <img
                                            src={`https://live.staticflickr.com/${image.server}/${image.id}_${image.secret}_w.jpg`}
                                            alt="flicr images"
                                            className={styles.searchRes__image}
                                            onClick={() => setOpenImage({ openImage: true, url: `https://live.staticflickr.com/${image.server}/${image.id}_${image.secret}_w.jpg` })}
                                        />
                                    </div>
                                );
                        })
                    }
                    <div>{loading && <img src={LoadingGif} alt="loading" />}</div>
                    <div>{error && 'Error'}</div>
                </div>
                {openImage.openImage
                    && openImage.url !== ""
                    && <ImageModal imgSrc={openImage.url} setOpenImage={setOpenImage}/>}
            </div>
        </>
    )
}