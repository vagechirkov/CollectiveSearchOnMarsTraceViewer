import {createContext, FC, useContext, useEffect, useReducer} from "react";
import tracesReducer, {ACTIONS} from "@/context/TracesReducer";

const examples = [
    "NP_slow_resource_9FE53778A1A7D688_F8C9B7F54C5C6636_ABBD3E4598036829_2BDBFDF4E9F3ABEF_4556754228EC9C87.txt",
    "NP_fast_resource_C7B7CEA62ACD94C7_2491AF65745A19AB_9ED34F0449348781_26FAC3287C4ED527_66672276B7EDD0ED.txt",
    "FP_slow_resource_2805D2460AF6ED91_D1F3AD421C0D25A0_DA02E7368CE5F747_3289B54D7FAEE3D2_E929E08041BE430E.txt",
    "FP_fast_resource_C297D7E9CB532B39_A2F1F2CB56E867B8_2D583462118D9282_575BA14AF13ECD1D_9DCF87B73BBADE90.txt"
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
