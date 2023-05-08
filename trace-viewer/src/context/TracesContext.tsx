import {createContext, FC, useContext, useEffect, useReducer} from "react";
import tracesReducer, {ACTIONS} from "@/context/TracesReducer";

const examples = [
    "ex_1_alone_resource_1DE846936D166543_0_traces.txt",
    "ex_2_multi_2_resource_156A4894999DCEE2_33144C1FA5587E4C_0_traces.txt",
    "ex_3_multi_2_resource_32FA06AE976FB58D_EE5B78DA65AE5B21_0_traces.txt"
]

const baseUrl = 'https://raw.githubusercontent.com/vagechirkov/CollectiveSearchOnMarsTraceViewer/main/examples/';


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

export type traceFile = {
    name: string;
    content: string;
}

export type TracesState = {
    files: traceFile[] | undefined;
    traces: agentTrace[] | undefined;
    currentFile: number;
}

export type TracesContextType = {
    tracesState: TracesState;
    tracesDispatcher: (action: any) => void;
};

const TraceContext = createContext<TracesContextType | null>(null);

export const tracesInitialState: TracesState = {
    files: undefined,
    traces: undefined,
    currentFile: 0
}

const tracesInitializer = (initialState: TracesState) => {
    // if (typeof window !== 'undefined') {
    //     return JSON.parse(localStorage.getItem(LOCAL_STORAGE_TRACES_STATE_KEY) || '{}') || initialState;
    // }
    return initialState;
}

interface ITracesContextProvider {
    children: any;
    saveToLocalStorage?: boolean;
}

export const TracesContextProvider: FC<ITracesContextProvider> = (props) => {
    const {children, saveToLocalStorage = true} = props;
    const [state, dispatch] = useReducer(tracesReducer, tracesInitialState, tracesInitializer);

    // useEffect(() => {
    //     if (saveToLocalStorage)
    //         localStorage.setItem(LOCAL_STORAGE_TRACES_STATE_KEY, JSON.stringify(state));
    // }, [state]);

    useEffect(() => {
        if (!state.files) {
            // fetch some example files from GitHub
            for (const f in examples) {
                const file = examples[f];
                const url = baseUrl + file;
                fetch(url)
                    .then(d => d.text())
                    .then(d => dispatch({
                            type: ACTIONS.ADD_FILE,
                            payload: {file: {name: file, content: d} as traceFile}
                        })
                    );
            }
        }

    }, [state.files]);

    return (
        <TraceContext.Provider value={{tracesState: state, tracesDispatcher: dispatch}}>
            {children}
        </TraceContext.Provider>
    );
};


const useTraceContext = () => useContext(TraceContext);

export default useTraceContext as () => TracesContextType;
