import { useEffect, useState } from "react";
import axios from 'axios';

export default function useImageFetch(pageNumber) {

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [images, setImages] = useState([])
    const [hasMore, setHasMore] = useState(false)

    useEffect(() => {
        (
            async function fetchImages() {
                setLoading(true)
                setError(false)
                await axios.get('https://www.flickr.com/services/rest', {
                    params: {
                        method: 'flickr.photos.getRecent',
                        api_key: '0f6e80f2d8ed3f6f7cab86b11c60fb7d',
                        per_page: 50,
                        page: pageNumber,
                        format: 'json',
                        nojsoncallback: 1
                    },
                })
                    .then(resp => {
                        console.log("response from use Image fetch: ", resp)  
                        setImages(prevImages => {
                            return [...prevImages, ...resp.data.photos.photo]
                        })
                        console.log("use image fetch response: ", resp)
                        setHasMore(resp.data.photos.pages > resp.data.photos.page)
                        setLoading(false)
                    }).catch(e => {
                        setError(true)
                    })
            }
        )()
    }, [pageNumber]);

    return { loading, error, images, hasMore };
}