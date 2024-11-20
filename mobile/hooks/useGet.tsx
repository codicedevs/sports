import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLoading } from "../context/loadingProvider";

type FetchFunction<T> = (context: QueryFunctionContext) => Promise<T>;

interface UseFetchProps<T> {
    fn: FetchFunction<T>;
    key: string[];
    triggerLoader?: boolean;
    options?: any;
    initialData?: T | null;
}

function useFetch<T>({
    fn,
    key,
    triggerLoader = false,
    options = {},
    initialData = null,
}: UseFetchProps<T>) {
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
