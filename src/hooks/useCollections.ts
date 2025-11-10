import { useEffect, useState } from 'react';
import { get } from '@/utils/request';
import type { Collection } from '@/types/collections';

let cache: Collection[] | null = null;
let inflight: Promise<Collection[]> | null = null;

export default function useCollections() {
    const [collections, setCollections] = useState<Collection[]>(cache ?? []);
    const [loading, setLoading] = useState<boolean>(!cache);
    const [error, setError] = useState<unknown | null>(null);

    useEffect(() => {
        if (cache) {
            setCollections(cache);
            setLoading(false);
            return;
        }

        if (!inflight) {
            inflight = (async () => {
                try {
                    const res = await get('/collections');
                    const cols = Array.isArray(res.response.data) ? res.response.data as Collection[] : [];
                    cache = cols;
                    return cols;
                } catch (err) {
                    throw err;
                } finally {
                    inflight = null;
                }
            })();
        }

        setLoading(true);
        inflight.then(cols => {
            setCollections(cols);
            setLoading(false);
        }).catch(err => {
            setError(err);
            setLoading(false);
        });
    }, []);

    const reload = async () => {
        try {
            setLoading(true);
            const res = await get('/collections');
            const cols = Array.isArray(res.response.data) ? res.response.data as Collection[] : [];
            cache = cols;
            setCollections(cols);
            setLoading(false);
            return cols;
        } catch (err) {
            setError(err);
            setLoading(false);
            throw err;
        }
    };

    return { collections, loading, error, reload };
}

