import { useEffect, useState } from "react";
import axios from 'axios';

export default function useImageHook(query, pageNumber) {

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [books, setBooks] = useState([])
    const [hasMore, setHasMore] = useState(false)

    useEffect(() => {
        setBooks([])
    },[query])

    useEffect(() => {
        setLoading(true)
        setError(false)
        let cancel
        axios.get('http://openlibrary.org/search.json', {
            params: {
                q: query,
                page: pageNumber
            },
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(resp => {
            setBooks(prevBooks => {
                return [...new Set([...prevBooks, ...resp.data.docs.map(b => b.title)])]
            })
            console.log("resp.data.docs.length", resp)
            setHasMore(resp.data.docs.length > 0)
            setLoading(false)
        }).catch(e => {
            if (axios.isCancel(e)) return
            setError(true)
        })
        return () => cancel()
    }, [query, pageNumber]);

    return { loading, error, books, hasMore };
}