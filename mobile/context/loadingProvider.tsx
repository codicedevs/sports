import { createContext, useContext, useEffect, useState } from "react";
import SpinnerScreen from "../components/spinnerScreen";

type LoadingContextType = {
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
};

const LoadingContext = createContext<LoadingContextType>({
    isLoading: false,
    setIsLoading: () => { }
});


export function LoadingProvider(props: React.PropsWithChildren) {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        console.log('Loading Screen State:', isLoading, 'q pasa aca');
    }, [isLoading])
    return (
        <LoadingContext.Provider
            value={{ isLoading, setIsLoading }}
        >
            <SpinnerScreen isLoading={isLoading} />
            {props.children}
        </LoadingContext.Provider>
    )
}

export const useLoading = () => useContext(LoadingContext);