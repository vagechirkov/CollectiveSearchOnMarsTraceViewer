import {createContext, FC, useContext, useReducer} from "react";
import tracesReducer from "@/context/TracesReducer";

const LOCAL_STORAGE_TRACES_STATE_KEY = 'networkState';

export type agentTrace = {
    id: number;
    time: number[];
    x: number[];
    z: number[];
    rotation: number[];
    signaling: number[];
    score: number[];
}

export type TracesState = {
    traces: agentTrace[] | undefined;
}

export type TracesContextType = {
    tracesState: TracesState;
    tracesDispatcher: (action: any) => void;
};

const TraceContext = createContext<TracesContextType | null>(null);

export const tracesInitialState: TracesState = {
    traces: undefined
}

const tracesInitializer = (initialState: TracesState) => {
    // return JSON.parse(localStorage.getItem(LOCAL_STORAGE_TRACES_STATE_KEY) || '{}') || initialState;
    return initialState;
}

interface ITracesContextProvider {
    children: any;
    saveToLocalStorage?: boolean;
}

export const TracesContextProvider: FC<ITracesContextProvider> = (props) => {
    const {children, saveToLocalStorage=true} = props;
    const [state, dispatch] = useReducer(tracesReducer, tracesInitialState, tracesInitializer);

    // useEffect(() => {
    //     if(saveToLocalStorage)
    //         localStorage.setItem(LOCAL_STORAGE_TRACES_STATE_KEY, JSON.stringify(state));
    // }, [state]);

    return (
        <TraceContext.Provider value={{tracesState: state, tracesDispatcher: dispatch}}>
            {children}
        </TraceContext.Provider>
    );
};


const useTraceContext = () => useContext(TraceContext);

export default useTraceContext as () => TracesContextType;
