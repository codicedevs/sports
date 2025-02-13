import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLoading } from "../context/loadingProvider";

type FetchFunction<T> = (context: QueryFunctionContext) => Promise<T>;

interface UseFetchOptions<T> {
    triggerLoader?: boolean;
    options?: any;
    initialData?: T | null;
}

function useFetch<T>(
    fn: FetchFunction<T>,
    key: string[],
    { triggerLoader = false, options = {}, initialData = null }: UseFetchOptions<T> = {}
) {
    const { setIsLoading } = useLoading();

    const query = useQuery<T>({
        queryKey: key,
        queryFn: fn,
        ...options,
        initialData
    });

    useEffect(() => {
        if (triggerLoader) {
            setIsLoading(query.isLoading || query.isFetching);
        }
    }, [query.isLoading, query.isFetching]);

    return query;
}

export default useFetch;
