import { useState, useEffect } from "react";

function useFetch(url) {
    const [data, setData] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const abortController = new AbortController();

    useEffect(() => {

        fetch(url, { signal: abortController.signal })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch data resource.");
                }
                return response.json();
            })
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });

            return () => {
                abortController.abort();
            }

    }, [url]);

    return { data, loading, error };
}

export default useFetch;