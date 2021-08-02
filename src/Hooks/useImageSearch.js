import { useEffect, useState } from "react";
import axios from 'axios';

export default function useImageSearch(query, pageNumber) {

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [images, setImages] = useState([])
    const [hasMore, setHasMore] = useState(false)

    useEffect(() => {
        setImages([])
    },[query])

    // https://www.flickr.com/services/rest/?method=flickr.photos.search
    // &api_key=bc9cb7fc262638d1c85b26618675b029
    // &text=cars
    // &safe_search=1
    // &per_page=50
    // &page=2
    // &format=json
    // &nojsoncallback=1

    useEffect(() => {
        if (query !== "") {
            setLoading(true)
            setError(false)
            // let cancel
            axios.get('https://www.flickr.com/services/rest', {
                params: {
                    method: 'flickr.photos.search',
                    api_key: '173ed8294f3e6ad8779bf8ce0884aded',
                    text: query,
                    safe_search: 1,
                    per_page: 50,
                    page: pageNumber,
                    format: 'json',
                    nojsoncallback: 1
                },
                // cancelToken: new axios.CancelToken(c => cancel = c)
            }).then(resp => {
                console.log("prevai: ", resp)
                if(resp.data.stat === "fail") throw Error("Api Expired")
                setImages(prevImages => {
                    return [...prevImages, ...resp.data.photos.photo]
                })
                console.log("resp.data.docs.length", resp)
                setHasMore(resp.data.photos.pages > resp.data.photos.page)
                setLoading(false)
            }).catch(e => {
                // if (axios.isCancel(e)) return
                console.log("error useImageSearh: ", e)
                setError(true)
            })
            // return () => cancel()
        }
    }, [query, pageNumber]);

    return { loading, error, images, hasMore };
}