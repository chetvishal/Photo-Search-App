import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './Home.module.css';
import { ImageModal } from '../../Components/index';
import useImageFetch from '../../Hooks/useImageFetch';
import LoadingGif from '../../Assets/gif/loading.gif'

export const Home = () => {
    const [pageNumber, setPageNumber] = useState(1)
    const [openImage, setOpenImage] = useState({ openImage: false, url: "" })
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


    return (
        <>
            <div className={styles.home}>
                <div className={styles.home__photoList}>
                    {
                        images.map((image, index) => {
                            if (images.length === index + 1)
                                return (
                                    <div className={styles.home__photoContainer}>
                                        <img
                                            src={`https://live.staticflickr.com/${image.server}/${image.id}_${image.secret}_w.jpg`}
                                            alt="flicr images"
                                            className={styles.home__image}
                                            ref={lastBookElementRef}
                                            onClick={() => setOpenImage({ openImage: true, url: `https://live.staticflickr.com/${image.server}/${image.id}_${image.secret}_w.jpg` })}
                                        />
                                    </div>
                                )
                            else
                                return (
                                    <div className={styles.home__photoContainer}>
                                        <img
                                            src={`https://live.staticflickr.com/${image.server}/${image.id}_${image.secret}_w.jpg`}
                                            alt="flicr images"
                                            className={styles.home__image}
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